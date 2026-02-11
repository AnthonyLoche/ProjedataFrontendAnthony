import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { ProductService } from '@/services'

export const useProductStore = defineStore('product', () => {
  const state = reactive({
    products: [],
  })

  const getAllProducts = async () => {
    try {
      const data = await ProductService.getAllProducts()
      state.products = data || []
    } catch (error) {
      console.error('Error fetching products in store:', error)
    }
  }

  const getProductById = async (productId) => {
    try {
      const data = await ProductService.getProductById(productId)
      return data
    } catch (error) {
      console.error(`Error fetching product with ID ${productId} in store:`, error)
    }
  }

  const createProduct = async (productData) => {
    try {
      const data = await ProductService.createProduct(productData)
      return data
    } catch (error) {
      console.error('Error creating product in store:', error)
    } finally {
      await getAllProducts()
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await ProductService.deleteProduct(productId)
    } catch (error) {
      console.error(`Error deleting product with ID ${productId} in store:`, error)
    } finally {
      await getAllProducts()
    }
  }

  const updateProduct = async (productId, productData) => {
    try {
      const data = await ProductService.updateProduct(productId, productData)
      return data
    } catch (error) {
      console.error(`Error updating product with ID ${productId} in store:`, error)
    } finally {
      await getAllProducts()
    }
  }

  const getProductMetrics = async (productId) => {
    try {
      const data = await ProductService.getProductMetrics(productId)
      return data
    } catch (error) {
      console.error(`Error fetching metrics for product with ID ${productId} in store:`, error)
    }
  }

  return {
    state,
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductMetrics
  }
})
