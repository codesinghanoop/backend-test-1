export const config = {
  port: process.env.PORT || 8000,
  expireTime: '7d',
  secrets: {
    jwt: process.env.JWT || 'anoop123'
  }
}