import request from '../utils/request'
const appId = __wxConfig.accountInfo.appId

// 登录
export const login = (params) => request.get(`/consult/pharmacist/wx/consult/wxuser/${appId}/mnLogin`, params)

// 获取token
export const getToken = (params) => request.post(`/consult/pharmacist/oauth/token`, params)

// 发送验证码
export const getMobileCode = (params) => request.get(`/platform/center/requestVerifyPharmacist`, params)

// 验证验证码
export const checkPhoneCode = (params) => request.get(`/platform/login/checkPhoneCode`, params)

// 获取登录信息
export const getUserInfo = (params) => request.get(`/consult/pharmacist/wx/consult/wxuser/${appId}/mnInfo`, params)

// 获取审核列表
export const getPharList = (params) =>
  request.get(`/consult/pharmacist/api/pharmacist/consult/press/getPharList`, params)

// 获取列表详情
export const getDetail = (params) => request.get(`/consult/pharmacist/api/pharmacist/consult/press/getDetail`, params)

// 获取签名图片
export const checkPharmacistCa = (params) =>
  request.post(`/consult/pharmacist/api/pharmacist/consult/press/checkPharmacistCa`, params)

// 审核药方
export const pressAudit = (params) =>
  request.post(`/consult/pharmacist/api/pharmacist/consult/press/pressAudit`, params)
