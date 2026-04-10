<script setup lang="ts">
import type { Category } from '@blog/shared'
import { createCategory, deleteCategory, getCategories, updateCategory } from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { UButton, UInput, UTextarea, USelectMenu } from '@/components/ui'

const searchQuery = ref('')
const categories = ref<Category[]>([])

const showModal = ref(false)
const editingCategory = ref<Category | null>(null)
const formData = ref({ name: '', slug: '', description: '' })

const showDeleteModal = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteTargetName = ref('')

function loadCategories() {
  categories.value = getCategories()
}

onMounted(loadCategories)

const filteredCategories = computed(() => {
  if (!searchQuery.value)
    return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(
    c => c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query),
  )
})

function openCreateModal() {
  editingCategory.value = null
  formData.value = { name: '', slug: '', description: '' }
  showModal.value = true
}

function openEditModal(category: Category) {
  editingCategory.value = category
  formData.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingCategory.value = null
  formData.value = { name: '', slug: '', description: '' }
}

function generateSlug() {
  if (!formData.value.slug && formData.value.name) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

function handleSubmit() {
  if (!formData.value.name || !formData.value.slug)
    return

  if (editingCategory.value) {
    updateCategory(editingCategory.value.id, formData.value)
  }
  else {
    createCategory(formData.value)
  }
  loadCategories()
  closeModal()
}

function openDeleteModal(id: string, name: string) {
  deleteTargetId.value = id
  deleteTargetName.value = name
  showDeleteModal.value = true
}

function confirmDelete() {
  if (deleteTargetId.value) {
    deleteCategory(deleteTargetId.value)
    loadCategories()
  }
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

function cancelDelete() {
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">分类管理</h1>
        <p class="mt-1 text-slate-500">管理博客文章分类</p>
      </div>
      <UButton color="blue" @click="openCreateModal">
        ➕ 新建分类
      </UButton>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col justify-between gap-4 md:flex-row">
        <UInput
          v-model="searchQuery"
          placeholder="搜索分类..."
          icon="search"
          class="w-full md:w-80"
        />
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">名称</th>
              <th class="hidden px-4 py-3 text-left text-sm font-medium text-slate-700 md:table-cell">别名</th>
              <th class="hidden px-4 py-3 text-left text-sm font-medium text-slate-700 lg:table-cell">描述</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">文章数</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="category in filteredCategories"
              :key="category.id"
              class="transition-colors hover:bg-slate-50"
            >
              <td class="px-4 py-3">
                <p class="font-medium text-slate-900">{{ category.name }}</p>
              </td>
              <td class="hidden px-4 py-3 md:table-cell">
                <code class="rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-600">{{ category.slug }}</code>
              </td>
              <td class="hidden px-4 py-3 lg:table-cell">
                <p class="max-w-xs truncate text-sm text-slate-500">
                  {{ category.description || '-' }}
                </p>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-slate-600">{{ category.postCount }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-blue-100"
                    title="编辑"
                    @click="openEditModal(category)"
                  >
                    ✏️
                  </button>
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-100"
                    title="删除"
                    @click="openDeleteModal(category.id, category.name)"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredCategories.length === 0" class="py-12 text-center">
        <div class="mx-auto mb-4 text-5xl">📂</div>
        <p class="mb-4 text-slate-500">暂无分类</p>
        <UButton color="blue" @click="openCreateModal">
          ➕ 创建第一个分类
        </UButton>
      </div>

      <div class="border-t border-slate-200 px-4 py-3">
        <span class="text-sm text-slate-500"> 共 {{ filteredCategories.length }} 个分类 </span>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">
            {{ editingCategory ? '编辑分类' : '新建分类' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">分类名称</label>
              <UInput
                v-model="formData.name"
                placeholder="输入分类名称"
                @blur="generateSlug"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">别名 (Slug)</label>
              <UInput v-model="formData.slug" placeholder="输入分类别名" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">描述</label>
              <UTextarea v-model="formData.description" placeholder="输入分类描述" rows="3" />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <UButton class="flex-1" variant="soft" @click="closeModal">取消</UButton>
            <UButton class="flex-1" color="blue" @click="handleSubmit">
              {{ editingCategory ? '保存' : '创建' }}
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancelDelete" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">⚠️</div>
            <h3 class="mb-2 text-xl font-bold text-slate-900">确认删除</h3>
            <p class="mb-4 text-slate-500">确定要删除分类"{{ deleteTargetName }}"吗？</p>
            <p class="mb-6 text-sm text-red-500">此操作无法撤销</p>
          </div>
          <div class="flex gap-3">
            <UButton class="flex-1" variant="soft" @click="cancelDelete">取消</UButton>
            <UButton class="flex-1" color="red" @click="confirmDelete">确认删除</UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
