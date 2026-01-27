#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
知识库查询系统 - 使用Qwen Embedding和Reranker模型
"""

import sqlite3
import json
import requests
import os
import struct
from typing import List, Dict, Optional

class KnowledgeBaseRetriever:
    def __init__(self, db_path: str, api_key: str):
        """初始化知识库检索器"""
        self.db_path = db_path
        self.api_key = api_key
        self.embedding_model = "Qwen/Qwen3-Embedding-8B"
        self.reranking_model = "Qwen/Qwen3-Reranker-8B"
        self.api_url = "https://api.siliconflow.cn/v1"  # Silicon Flow API
        
        # 连接数据库
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        
    def get_embedding(self, text: str) -> Optional[List[float]]:
        """调用Qwen Embedding模型获取文本向量"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": self.embedding_model,
                "input": text,
                "encoding_format": "float"
            }
            
            response = requests.post(
                f"{self.api_url}/embeddings",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['data'][0]['embedding']
            else:
                print(f"Embedding API错误: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"获取Embedding失败: {e}")
            return None
    
    def retrieve_from_db(self, limit: int = 50) -> List[Dict]:
        """从SQLite数据库检索所有向量记录"""
        try:
            self.cursor.execute(
                "SELECT id, pageContent, source FROM vectors LIMIT ?",
                (limit,)
            )
            rows = self.cursor.fetchall()
            
            results = []
            for row_id, content, source in rows:
                results.append({
                    'id': row_id,
                    'content': content,
                    'source': source
                })
            
            return results
            
        except Exception as e:
            print(f"数据库查询失败: {e}")
            return []
    
    def get_vector_from_db(self, record_id: str) -> Optional[List[float]]:
        """从数据库获取记录的向量"""
        try:
            self.cursor.execute(
                "SELECT vector FROM vectors WHERE id = ?",
                (record_id,)
            )
            result = self.cursor.fetchone()
            if result and result[0]:
                vector_bytes = result[0]
                if isinstance(vector_bytes, bytes):
                    try:
                        # 假设是float32格式
                        vector = list(struct.unpack(f'{len(vector_bytes)//4}f', vector_bytes))
                        return vector
                    except:
                        pass
            return None
        except Exception:
            return None
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """计算两个向量的余弦相似度"""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = sum(a ** 2 for a in vec1) ** 0.5
        magnitude2 = sum(b ** 2 for b in vec2) ** 0.5
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        搜索知识库
        1. 将查询转为向量
        2. 在SQLite中使用相似度检索
        3. 使用Reranker重排结果
        """
        
        print(f"\n🔍 搜索查询: {query}")
        
        # 步骤1: 获取查询的向量表示
        print("  → 获取查询向量...")
        query_embedding = self.get_embedding(query)
        
        if query_embedding is None:
            print("  ⚠️  无法获取查询向量，使用关键词检索")
            return self._keyword_search(query, top_k)
        
        # 步骤2: 从数据库获取所有记录
        print("  → 检索候选文档...")
        all_records = self.retrieve_from_db(limit=100)
        
        if not all_records:
            return []
        
        # 步骤3: 获取所有记录的向量并计算相似度
        print("  → 计算向量相似度...")
        scored_records = []
        
        for record in all_records:
            record_vector = self.get_vector_from_db(record['id'])
            
            if record_vector:
                similarity = self._cosine_similarity(query_embedding, record_vector)
                scored_records.append({
                    **record,
                    'score': similarity
                })
        
        if not scored_records:
            print("  ⚠️  未找到向量，使用关键词检索")
            return self._keyword_search(query, top_k)
        
        # 步骤4: 排序并获取top候选
        scored_records.sort(key=lambda x: x['score'], reverse=True)
        candidates = scored_records[:min(top_k * 3, len(scored_records))]
        
        # 步骤5: 使用Reranker重排结果
        if len(candidates) > 1:
            print("  → 使用Reranker重排...")
            candidates = self._rerank_results(query, candidates, top_k)
        
        print(f"✅ 检索到 {len(candidates)} 条相关结果")
        
        return candidates[:top_k]
    
    def _rerank_results(self, query: str, candidates: List[Dict], top_k: int) -> List[Dict]:
        """使用Qwen Reranker重排结果"""
        try:
            if not candidates:
                return []
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # 准备重排数据
            documents = [c['content'][:1000] for c in candidates]
            
            data = {
                "model": self.reranking_model,
                "query": query,
                "documents": documents,
                "top_n": min(top_k, len(candidates))
            }
            
            response = requests.post(
                f"{self.api_url}/rerank",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                reranked_results = result.get('results', [])
                if reranked_results:
                    reranked_results.sort(key=lambda x: x['score'], reverse=True)
                    reranked_indices = [r['index'] for r in reranked_results]
                    return [candidates[i] for i in reranked_indices if i < len(candidates)]
            
            return candidates
                
        except Exception as e:
            print(f"  ⚠️  Reranker异常: {str(e)[:100]}")
            return candidates
    
    def _keyword_search(self, query: str, top_k: int) -> List[Dict]:
        """关键词搜索的备用方案"""
        try:
            search_pattern = f"%{query}%"
            self.cursor.execute(
                "SELECT id, pageContent, source FROM vectors WHERE pageContent LIKE ? LIMIT ?",
                (search_pattern, top_k)
            )
            rows = self.cursor.fetchall()
            
            results = []
            for row_id, content, source in rows:
                results.append({
                    'id': row_id,
                    'content': content,
                    'source': source,
                    'score': 0.0
                })
            
            return results
            
        except Exception as e:
            print(f"关键词检索失败: {e}")
            return []
    
    def format_results(self, results: List[Dict]) -> str:
        """格式化检索结果"""
        if not results:
            return "未找到相关内容"
        
        output = []
        output.append(f"\n检索结果 (共 {len(results)} 条):\n")
        output.append("=" * 80)
        
        for i, result in enumerate(results, 1):
            score = result.get('score', 0)
            content = result['content']
            
            output.append(f"\n[{i}] 相似度: {score:.2%}")
            output.append(f"来源: {os.path.basename(result['source'])}")
            output.append("-" * 80)
            output.append(f"\n原文内容:\n{content}\n")
            output.append("=" * 80)
        
        return "\n".join(output)
    
    def close(self):
        """关闭数据库连接"""
        if self.conn:
            self.conn.close()


def main():
    """测试知识库查询系统"""
    
    # 配置
    db_path = r"c:\Users\kamac\OneDrive\Doc_P\Obsidian\Vault\后台资源管理功能\knowledge\WhhtE9D9N6SYooiRSmud4"
    api_key = "sk-liomwimciyykbprjkecotbrnsoplnoxctgqxsubvxbnnmnho"
    
    # 初始化检索器
    print("初始化知识库检索器...")
    retriever = KnowledgeBaseRetriever(db_path, api_key)
    
    # 测试查询
    test_queries = [
        "装备系统如何设计？",
        "游戏框架有哪些模块？",
        "货币系统规范是什么？"
    ]
    
    for query in test_queries:
        results = retriever.search(query, top_k=3)
        print(retriever.format_results(results))
        print("-" * 60)
    
    retriever.close()
    print("\n✅ 知识库查询系统测试完成！")


if __name__ == "__main__":
    main()
