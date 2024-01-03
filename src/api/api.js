import http from "@/api/http";

export const success_code = 20000
export const error_code = 40000

// 解析用户是否登录
export const checkUser = (url) => {
    return http.requestGet(url)
}
// 登录
export const doLogin = (url, userInfo) => {
    return http.requestPost(url, userInfo)
}
// 获取分类列表
export const getCategories = (url) =>{
    return http.requestGet(url)
}
// 删除分类
export const disableCategory = (url) =>{
    return http.requestDelete(url);
}
// 恢复分类
export const  refreshCategory = (url) => {
    return http.requestPut(url)
}
// 添加分类
export const addCategory = (url, category) => {
    return http.requestPost(url, category)
}
// 更新分类
export const updateCategory = (url, category) =>{
    return http.requestPut(url, category)
}
// 获取轮播图列表
export const listLoops = (url) => {
    return http.requestGet(url)
}
// 删除轮播图
export const deleteLoop = (url) => {
    return http.requestDelete(url)
}
// 添加轮播图
export const addLoop = (url, loop) =>{
    return http.requestPost(url, loop)
}
// 编辑轮播图
export const updateLoop = (url, loop) => {
    return http.requestPut(url, loop)
}
// 获取用户列表
export const listUsers = (url) => {
    return http.requestGet(url)
}
// 禁用用户
export const disableUser = (url) =>{
    return http.requestDelete(url)
}
// 恢复用户
export const refreshUser = (url) => {
    return http.requestPut(url)
}
// 重置密码
export const resetPassword = (url) => {
    return http.requestPut(url)
}
// 检查邮箱
export const checkEmail = (url) => {
    return http.requestGet(url)
}
// 发送邮件
export const sendVerifyCode = (url) => {
    return http.requestGet(url)
}
// 更新邮箱
export const updateEmail = (url) => {
    return http.requestPut(url)
}
// 获取单个用户信息
export const getUserInfo = (url) =>{
    return http.requestGet(url)
}
// 修改用户信息
export const updateUserInfo = (url, user) => {
    return http.requestPut(url, user)
}
// 检查用户名是否注册
export const checkUsername = (url, userName) => {
    return http.requestGet(url, userName)
}
// 网站seo信息
export const getWebsiteSeo = (url) => {
    return http.requestGet(url)
}
// 网站标题信息
export const getWebsiteTitle = (url) => {
    return http.requestGet(url)
}
// 修改网站标题信息
export const updateWebsiteTitle = (url) => {
    return http.requestPut(url)
}
// 修改网站seo信息
export const updateWebsiteSeo = (url) =>{
    return http.requestPut(url)
}
// 删除友情链接
export const deleteLink = (url) => {
    return http.requestDelete(url)
}
// 增加友情链接
export const addLink = (url, link) => {
    return http.requestPost(url, link)
}
// 获取友链列表
export const listLinks = (url) => {
    return http.requestGet(url)
}
// 更新友情链接
export const updateLink = (url, link) => {
    return http.requestPut(url, link)
}
// 获取全部分类（无分页）
export const getAllCategories = (url) => {
    return http.requestGet(url)
}
// 获取图片列表
export const listImages = (url) => {
    return http.requestGet(url)
}
// 提交文章
export const postArticle = (url, article) => {
    return http.requestPost(url, article)
}
// 获取文章列表
export const listArticles = (url) => {
    return http.requestGet(url)
}
// 根据分类id获取分类名称
export const getCategory = (url) => {
    return http.requestGet(url)
}
// 删除文章
export const deleteArticle = (url) => {
    return http.requestDelete(url)
}
// 置顶与取消置顶文章
export const resetArticleTop = (url) => {
    return http.requestPut(url)
}
// 获取单个文章
export const getArticleById = (url) => {
    return http.requestGet(url)
}
// 更新文章
export const updateArticle = (url, article) => {
    return http.requestPut(url, article)
}
// 获取评论列表
export const listComments = (url) => {
    return http.requestGet(url)
}
// 置顶评论
export const resetCommentTop = (url) => {
    return http.requestPut(url)
}
// 删除评论
export const deleteComment = (url) => {
    return http.requestDelete(url)
}
// 删除照片
export const deleteImage = (url) => {
    return http.requestDelete(url)
}
// 恢复照片
export const refreshImage = (url) => {
    return http.requestPut(url)
}
// 获取全部照片来源
export const getImageOrigins = (url) => {
    return http.requestGet(url)
}
// 获取最新评论
export const getCommentsNew = (url) => {
    return http.requestGet(url)
}
// 获取网站访问量
export const getWebsiteViewCount = (url) => {
    return http.requestGet(url)
}
// 获取注册用户总数
export const getRegisterCount = (url) => {
    return http.requestGet(url)
}
// 获取文章总数
export const getArticleCount = (url) => {
    return http.requestGet(url)
}
// 获取评论总数
export const getCommentCount = (url) => {
    return http.requestGet(url)
}
// 退出登录
export const doLogout = (url) => {
    return http.requestDelete(url)
}
// 初始化管理员账号
export const initAdmin = (userInfo) => {
    return http.requestPost("/user/init_admin", userInfo)
}