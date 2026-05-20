<template>
  <div class="media">
    <h1>Media</h1>
    <div class="media-upload" :style="glassmorphism">
      <div class="upload-zone" @dragover.prevent="dragover" @drop.prevent="drop">
        <input
          type="file"
          id="file-upload"
          multiple
          @change="handleFiles"
          accept="image/*,video/*"
        />
        <label for="file-upload">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>Drag & drop files here or click to upload</p>
        </label>
      </div>
      <div class="upload-actions">
        <Button type="primary" @click="uploadFiles">Upload</Button>
        <Button type="text" @click="clearFiles">Clear</Button>
      </div>
    </div>
    <div class="media-grid" v-if="media.length">
      <div
        v-for="item in media"
        :key="item.id"
        class="media-item"
        :style="glassmorphism"
      >
        <div class="media-thumbnail">
          <img
            v-if="item.type.startsWith('image')"
            :src="item.thumbnailUrl || item.url"
            :alt="item.name"
          />
          <video v-else-if="item.type.startsWith('video')" :src="item.url" />
          <div v-else class="file-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
          </div>
        </div>
        <div class="media-info">
          <h4>{{ item.name }}</h4>
          <p>{{ item.type }}</p>
          <div class="media-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="media-actions">
          <Button type="text" @click="editMedia(item.id)">Edit</Button>
          <Button type="text" @click="deleteMedia(item.id)">Delete</Button>
        </div>
      </div>
    </div>
    <div v-else class="media-empty">
      <p>No media found. Upload some files to get started!</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Button from '../components/Button.vue'

export default defineComponent({
  name: 'Media',
  components: {
    Button,
  },
  setup() {
    const store = useStore()
    const files = ref<File[]>([])
    const glassmorphism = {
      background: 'rgba(248, 244, 230, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(224, 224, 224, 0.3)',
    }

    const dragover = (event: DragEvent) => {
      event.currentTarget?.classList.add('dragover')
    }

    const drop = (event: DragEvent) => {
      event.currentTarget?.classList.remove('dragover')
      if (event.dataTransfer?.files) {
        files.value = Array.from(event.dataTransfer.files)
      }
    }

    const handleFiles = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files) {
        files.value = Array.from(target.files)
      }
    }

    const uploadFiles = () => {
      // Upload files logic
      console.log('Upload files:', files.value)
    }

    const clearFiles = () => {
      files.value = []
    }

    const editMedia = (id: string) => {
      // Edit media logic
      console.log('Edit media:', id)
    }

    const deleteMedia = (id: string) => {
      // Delete media logic
      console.log('Delete media:', id)
    }

    onMounted(async () => {
      await store.dispatch('fetchMedia')
    })

    return {
      media: store.state.media,
      files,
      glassmorphism,
      dragover,
      drop,
      handleFiles,
      uploadFiles,
      clearFiles,
      editMedia,
      deleteMedia,
    }
  },
})
</script>

<style scoped>
.media {
  padding: 1.5rem;
}

.media-upload {
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.upload-zone {
  border: 2px dashed #E0E0E0;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1rem;
  transition: border 0.2s;
}

.upload-zone.dragover {
  border-color: #2A5C8A;
}

.upload-zone input {
  display: none;
}

.upload-zone label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-zone svg {
  color: #2A5C8A;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.media-item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.media-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.media-thumbnail {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F0F0F0;
  overflow: hidden;
}

.media-thumbnail img, .media-thumbnail video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon svg {
  color: #2A5C8A;
}

.media-info {
  padding: 1rem;
}

.media-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2A5C8A;
}

.media-info p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.media-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background-color: rgba(42, 92, 138, 0.1);
  color: #2A5C8A;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.media-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem 1rem 1rem;
  gap: 0.5rem;
}

.media-empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>