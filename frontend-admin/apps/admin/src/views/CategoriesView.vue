<script setup lang="ts">
import type { Category } from '@blog/shared'
import {
  createCategory,
  deleteCategory,
  getCategories,
  recalculateAllCategoryPostCounts,
  updateCategory,
} from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { UButton, UCheckbox, UInput } from '@/components/ui'

const searchQuery = ref('')
const categories = ref<Category[]>([])
const selectedCategories = ref<string[]>([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showBatchDeleteModal = ref(false)

const newCategory = ref({ name: '', slug: '', description: '' })
const editingCategory = ref<Category | null>(null)
const deleteTargetId = ref<string | null>(null)
const deleteTargetName = ref('')

function loadCategories() {
  categories.value = getCategories()
  recalculateAllCategoryPostCounts()
}

onMounted(loadCategories)

const filteredCategories = computed(() => {
  if (!searchQuery.value)
    return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(
    c => c.name.toLowerCase().includes(query)
      || c.slug.toLowerCase().includes(query)
      || c.description?.toLowerCase().includes(query),
  )
})

function openCreateModal() {
  newCategory.value = { name: '', slug: '', description: '' }
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
  newCategory.value = { name: '', slug: '', description: '' }
}

function handleCreate() {
  if (newCategory.value.name && newCategory.value.slug) {
    createCategory(newCategory.value)
    loadCategories()
    closeCreateModal()
  }
}

function openEditModal(category: Category) {
  editingCategory.value = { ...category }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingCategory.value = null
}

function handleEdit() {
  if (editingCategory.value) {
    updateCategory(editingCategory.value.id, {
      name: editingCategory.value.name,
      slug: editingCategory.value.slug,
      description: editingCategory.value.description,
    })
    loadCategories()
    closeEditModal()
  }
}

function openDeleteModal(id: string, name: string) {
  deleteTargetId.value = id
  deleteTargetName.value = name
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

function handleDelete() {
  if (deleteTargetId.value) {
    deleteCategory(deleteTargetId.value)
    loadCategories()
    closeDeleteModal()
  }
}

function openBatchDeleteModal() {
  showBatchDeleteModal.value = true
}

function closeBatchDeleteModal() {
  showBatchDeleteModal.value = false
}

function handleBatchDelete() {
  selectedCategories.value.forEach((id) => {
    deleteCategory(id)
  })
  selectedCategories.value = []
  loadCategories()
  closeBatchDeleteModal()
}

function generateSlug() {
  if (newCategory.value.name && !newCategory.value.slug) {
    newCategory.value.slug = newCategory.value.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
  if (editingCategory.value?.name && !editingCategory.value.slug) {
    editingCategory.value.slug = editingCategory.value.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          分类管理
        </h1>
        <p class="mt-1 text-slate-500">
          管理博客文章分类，用于对文章进行归类组织
        </p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col justify-between gap-4 md:flex-row">
        <div class="flex flex-1 gap-4">
          <UInput
            v-model="searchQuery"
            placeholder="搜索分类..."
            icon="search"
            class="w-full md:w-80"
          />
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="selectedCategories.length > 0"
            color="red"
            variant="soft"
            @click="openBatchDeleteModal"
          >
            🗑️ 删除选中 ({{ selectedCategories.length }})
          </UButton>
          <UButton @click="openCreateModal">
            ➕ 新建分类
          </UButton>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="w-12 px-4 py-3">
                <UCheckbox
                  :model-value="
                    selectedCategories.length === filteredCategories.length
                    && filteredCategories.length > 0
                  "
                  :indeterminate="
                    selectedCategories.length > 0
                    && selectedCategories.length < filteredCategories.length
                  "
                  @update:model-value="
                    selectedCategories = $event ? filteredCategories.map((c) => c.id) : []
                  "
                />
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                名称
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                Slug
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                描述
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                文章数
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-slate-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="category in filteredCategories"
              :key="category.id"
              class="transition-colors hover:bg-slate-50"
            >
              <td class="px-4 py-3">
                <UCheckbox
                  :model-value="selectedCategories.includes(category.id)"
                  @update:model-value="
                    selectedCategories = $event
                      ? [...selectedCategories, category.id]
                      : selectedCategories.filter((id) => id !== category.id)
                  "
                />
              </td>
              <td class="px-4 py-3">
                <span class="font-medium text-slate-900">
                  {{ category.name }}
                </span>
              </td>
              <td class="px-4 py-3">
                <code class="rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-600">
                  {{ category.slug }}
                </code>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-slate-600">
                  {{ category.description || '-' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-slate-600">
                  {{ category.postCount || 0 }}
                </span>
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
        <div class="mx-auto mb-4 text-5xl">
          📁
        </div>
        <p class="mb-4 text-slate-500">
          暂无分类
        </p>
        <UButton @click="openCreateModal">
          ➕ 创建第一个分类
        </UButton>
      </div>

      <div class="border-t border-slate-200 px-4 py-3">
        <span class="text-sm text-slate-500"> 共 {{ filteredCategories.length }} 个分类 </span>
      </div>
    </div>

    <!-- 新建分类弹窗 -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCreateModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">
            新建分类
          </h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                分类名称
              </label>
              <UInput
                v-model="newCategory.name"
                placeholder="输入分类名称"
                @blur="generateSlug"
                autofocus
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                URL 别名 (Slug)
              </label>
              <UInput
                v-model="newCategory.slug"
                placeholder="输入 url 友好的别名"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                描述 (可选)
              </label>
              <textarea
                v-model="newCategory.description"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="简单描述这个分类"
                rows="3"
              />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeCreateModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!newCategory.name || !newCategory.slug"
              @click="handleCreate"
            >
              创建
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 编辑分类弹窗 -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEditModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">
            编辑分类
          </h3>
          <div class="space-y-4" v-if="editingCategory">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                分类名称
              </label>
              <UInput
                v-model="editingCategory.name"
                placeholder="输入分类名称"
                @blur="generateSlug"
                autofocus
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                URL 别名 (Slug)
              </label>
              <UInput
                v-model="editingCategory.slug"
                placeholder="输入 url 友好的别名"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                描述 (可选)
              </label>
              <textarea
                v-model="editingCategory.description"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="简单描述这个分类"
                rows="3"
              />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeEditModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!editingCategory?.name || !editingCategory?.slug"
              @click="handleEdit"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDeleteModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="text-center">
            <div
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl"
            >
              ⚠️
            </div>
            <h3 class="mb-2 text-xl font-bold text-slate-900">
              确认删除
            </h3>
            <p class="mb-2 text-slate-500">
              确定要删除以下分类吗？
            </p>
            <p class="mb-6 truncate px-4 font-medium text-slate-700">
              "{{ deleteTargetName }}"
            </p>
            <p class="mb-6 text-sm text-red-500">
              此操作无法撤销
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeDeleteModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              @click="handleDelete"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 批量删除确认弹窗 -->
    <Teleport to="body">
      <div
        v-if="showBatchDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeBatchDeleteModal"
        />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="text-center">
            <div
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl"
            >
              ⚠️
            </div>
            <h3 class="mb-2 text-xl font-bold text-slate-900">
              批量删除
            </h3>
            <p class="mb-4 text-slate-500">
              确定要删除选中的
              <span class="font-bold text-red-500">{{ selectedCategories.length }}</span> 个分类吗？
            </p>
            <p class="mb-6 text-sm text-red-500">
              此操作无法撤销
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeBatchDeleteModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              @click="handleBatchDelete"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
