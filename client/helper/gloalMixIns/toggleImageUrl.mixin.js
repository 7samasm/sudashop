export default {
  methods: {
    imageUrl(imageUrl) {
      if (process.env['NODE_ENV'] !== "production") /*dev moe*/{
        const random = Math.floor(Math.random() * 8)
        return process.env['baseUrl'] + '/' + `item-${random}.jpg`
      }
      const isInitialImage = !(imageUrl + '').includes('http')
      // serve static image as fallback case user didn't upload a file
      if (isInitialImage) return process.env['baseUrl'] + '/' + imageUrl
      // for production serve an actioal db url and fake for devolopment 
      return imageUrl
    },
  }
}