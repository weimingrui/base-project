/*
 * @Author: Arthur
 * @Date: 2023-02-23 19:15:28
 * @LastEditors: Arthur
 * @LastEditTime: 2023-02-23 19:15:48
 * @Description: file content
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const algorithm = 'aes-256-gcm'
const hexEncoding = 'hex'
const utf8Encoding = 'utf8'

/**
 * @description: 密码加密 （可以解密）
 * @param {string} pwd 加密前的密码
 * @return {string} 加密后的密码
 */
export function cEncrypt(pwd) {
  const key = randomBytes(32)
  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, key, iv)
  let encrypted = `${cipher.update(
    pwd,
    utf8Encoding,
    hexEncoding
  )}${cipher.final(hexEncoding)}`
  // algorithm 为 aes-xxx-gcm 时需要使用
  const authTag = cipher.getAuthTag().toString(hexEncoding)
  const ivStr = iv.toString(hexEncoding)
  const keyStr = key.toString(hexEncoding)
  encrypted = [encrypted, keyStr, ivStr, authTag].join('|')
  return encrypted
}

/**
 * @description: 密码解密
 * @param {string} encryptedPwd 经过cEncrypt方法加密的密码
 * @return {*} 明文密码
 */
export function cDecrypt(encryptedPwd) {
  const [encrypted, keyStr, ivStr, authTag] = encryptedPwd.split('|')
  const key = Buffer.from(keyStr, hexEncoding)
  const iv = Buffer.from(ivStr, hexEncoding)
  const decipher = createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(Buffer.from(authTag, hexEncoding))
  let decrypted = `${decipher.update(
    encrypted,
    hexEncoding,
    utf8Encoding
  )}${decipher.final(utf8Encoding)}`
  return decrypted
}
