import api from '@/plugin/axios'
import { showMessage } from '@/utils/toastfy'

class RawMaterialService {
  async getAllRawMaterials() {
    try {
      const response = await api.get('/raw-materials')
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error fetching raw materials:', error)
    }
  }

  async getRawMaterialById(rawMaterialId) {
    try {
      const response = await api.get(`/raw-materials/${rawMaterialId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching raw material with ID ${rawMaterialId}:`, error)
    }
  }

  async createRawMaterial(rawMaterialData) {
    try {
      const response = await api.post('/raw-materials', rawMaterialData)
      showMessage('Matéria-prima criada com sucesso!', 'success', 2000, 'top-right', 'light', false)
      return response.data
    } catch (error) {
      console.error('Error creating raw material:', error)
    }
  }

  async deleteRawMaterial(rawMaterialId) {
    try {
      await api.delete(`/raw-materials/${rawMaterialId}`)
      showMessage('Matéria-prima deletada com sucesso!', 'success', 2000, 'top-right', 'light', false)
    } catch (error) {
      console.error(`Error deleting raw material with ID ${rawMaterialId}:`, error)
    }
  }
}

export default new RawMaterialService()
