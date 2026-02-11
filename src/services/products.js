import api from '@/plugin/axios'
import { showMessage } from '@/utils/toastfy'
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
      showMessage('Produto criado com sucesso!', 'success', 2000, 'top-right', 'light', false)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  async deleteProduct(productId) {
    try {
      await api.delete(`/products/${productId}`)
      showMessage('Produto deletado com sucesso!', 'success', 2000, 'top-right', 'light', false)
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error)
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/products/${productId}`, productData)
      showMessage('Produto atualizado com sucesso!', 'success', 2000, 'top-right', 'light', false)
      return response.data
    } catch (error) {
      console.error(`Error updating product with ID ${productId}:`, error)
    }
  }

  async getProductMetrics(productId) {
    try {
      const response = await api.get(`/products/${productId}/production`)
      return response.data
    } catch (error) {
      console.error(`Error fetching metrics for product with ID ${productId}:`, error)
    }
  }
}

export default new ProductsService()
