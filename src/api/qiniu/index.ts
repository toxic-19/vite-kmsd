// Vue实现七牛云存储上
import CryptoJS from 'crypto-js'
import * as qiniu from 'qiniu-js'
import { Extra, Config } from 'qiniu-js/src/upload/base.ts'
import { base64Encode, utf16to8 } from '@/utils/constant.ts'

type OSS = {
  accessKey: string
  secretKey: string
  bucket: string
  domain: string
}
const oss: OSS = {
  accessKey: 'XVIK4dvlv8KY9XueldYH_DKJrFQZe_AbiSCAuJD0',
  secretKey: 'Mc2Wg_uN8n6eH5n_8Z1rFkwHUvr7UAa0mtUTfe9L',
  bucket: 'toxic1901',
  // domain: 'http://sddfn230x.hn-bkt.clouddn.com',
  domain: 'http://upload-z2.qiniup.com',
}
export function uploadImages(file: File) {
  const uploadToken = getToken(oss.accessKey, oss.secretKey, oss.bucket)
  const key = `images/${file.name}`
  const config: Config = {
    useCdnDomain: true,
    region: qiniu.region.z2,
    forceDirect: true, // 是否上传全部采用直传方式
  }
  const putExtra = {
    fname: file.name, //文件原文件名
    mimeType: ['image/png', 'image/jpeg', 'image/gif'], //用来限制上传文件类型，为 null 时表示不对文件类型限制；
  }
  const options = {
    quality: 0.92,
    noCompressIfLarger: true
    // maxWidth: 1000,
    // maxHeight: 618
  }
  return qiniu.upload(file, key, uploadToken, putExtra, config)
}

const getToken = (access_key: string, secret_key: string, bucketname: string) => {
  // 构造策略
  const putPolicy = {
    scope: bucketname,
    deadline: 3600 + Math.floor(Date.now() / 1000),
  }
  const encoded = base64Encode(utf16to8(JSON.stringify(putPolicy)))
  // const encoded = CryptoJS.enc.Base64.stringify(putPolicy)
  const hash = CryptoJS.HmacSHA1(encoded, secret_key)
  // 构造凭证
  const encodedSign = hash.toString(CryptoJS.enc.Base64).replace(/\//g, '_').replace(/\+/g, '-')
  return access_key + ':' + encodedSign + ':' + encoded
}
