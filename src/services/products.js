import api from '@/plugin/axios'

class ProductsService {
  async getAllProducts() {
    try {
      const response = await api.get('/products')
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error)
    }
  }

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }
}

export default new ProductsService()
