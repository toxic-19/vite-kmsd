import axiosInstance from '@/utils/request'
import { CreateArticle, CreateResData, GetContentForm, TagResData, UpdateArticle } from './type'
enum API {
  article_content_url = '/article/getContent', // 通过articleId获取文章内容
  article_tagsName_url = '/tag/getName', // 通过articleId获取文章的标签
  article_create_url = '/article/createDoc', // 创建知识库下或分组下的文章
  article_update_url = '/article/updateDoc', // 编辑文章 title content
  article_delete_url = '/article/deleteArticle', // 删除文章 articleId
  article_list_url = '/article/getByTagId', // 通过tagId获取文章列表
}
export const getContentById = (params: GetContentForm) => axiosInstance.get<any>(API.article_content_url, { params })
export const getTagsById = (params: GetContentForm) => axiosInstance.get<any, TagResData>(API.article_tagsName_url, { params })
export const postArticle = (data: CreateArticle) => axiosInstance.post<any, CreateResData>(API.article_create_url, data)
export const updateArticle = (articleId: number, data: UpdateArticle) =>
  axiosInstance.post(`${API.article_update_url}/${articleId}`, data)
export const deleteArticle = (params: { articleId: number }) => axiosInstance.post(API.article_delete_url, {}, { params })
export const getArticleByTagId = (params: { tagId: number }) => axiosInstance.get<any>(API.article_list_url, { params })
