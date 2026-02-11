import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { RawMaterialService } from '../services'

export const useRawMaterialStore = defineStore('rawMaterial', () => {
  const state = reactive({
    rawMaterials: [],
  })

  const getAllRawMaterials = async () => {
    try {
      const data = await RawMaterialService.getAllRawMaterials()
      state.rawMaterials = data || []
    } catch (error) {
      console.error('Error fetching raw materials in store:', error)
    }
  }

  const getRawMaterialById = async (rawMaterialId) => {
    try {
      const data = await RawMaterialService.getRawMaterialById(rawMaterialId)
      return data
    } catch (error) {
      console.error(`Error fetching raw material with ID ${rawMaterialId} in store:`, error)
    }
  }

  const createRawMaterial = async (rawMaterialData) => {
    try {
      const data = await RawMaterialService.createRawMaterial(rawMaterialData)
      return data
    } catch (error) {
      console.error('Error creating raw material in store:', error)
    } finally{
      await getAllRawMaterials()
    }
  }

  const deleteRawMaterial = async (rawMaterialId) => {
    try {
      await RawMaterialService.deleteRawMaterial(rawMaterialId)
    } catch (error) {
      console.error(`Error deleting raw material with ID ${rawMaterialId} in store:`, error)
    } finally{
      await getAllRawMaterials()
    }
  }

  const updateRawMaterial = async (rawMaterialId, rawMaterialData) => {
    try {
      const data = await RawMaterialService.updateRawMaterial(rawMaterialId, rawMaterialData)
      return data
    } catch (error) {
      console.error(`Error updating raw material with ID ${rawMaterialId} in store:`, error)
    } finally{
      await getAllRawMaterials()
    }
    }

  return {
    state,
    getAllRawMaterials,
    getRawMaterialById,
    createRawMaterial,
    deleteRawMaterial,
    updateRawMaterial,
  }
})
