<script setup lang="ts">
import type { Post } from '@blog/shared'
import { deletePost, formatDate, getPosts } from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { UButton, UCheckbox, UInput, USelectMenu } from '@/components/ui'

const searchQuery = ref('')
const selectedStatus = ref<string>('')
const posts = ref<Post[]>([])

// 删除确认弹窗
const showDeleteModal = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteTargetTitle = ref('')

// 加载文章
function loadPosts() {
  posts.value = getPosts()
}

onMounted(loadPosts)

const filteredPosts = computed(() => {
  let result = posts.value
  if (selectedStatus.value) {
    result = result.filter(p => p.status === selectedStatus.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      p => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query),
    )
  }
  return result
})

const selectedPosts = ref<string[]>([])

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
  }
  return labels[status] || status
}

// 打开删除确认弹窗
function openDeleteModal(id: string, title: string) {
  deleteTargetId.value = id
  deleteTargetTitle.value = title
  showDeleteModal.value = true
}

// 确认删除
function confirmDelete() {
  if (deleteTargetId.value) {
    deletePost(deleteTargetId.value)
    loadPosts()
  }
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetTitle.value = ''
}

// 取消删除
function cancelDelete() {
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetTitle.value = ''
}

// 批量删除弹窗
const showBatchDeleteModal = ref(false)

function openBatchDeleteModal() {
  showBatchDeleteModal.value = true
}

function confirmBatchDelete() {
  selectedPosts.value.forEach(id => deletePost(id))
  loadPosts()
  selectedPosts.value = []
  showBatchDeleteModal.value = false
}

function cancelBatchDelete() {
  showBatchDeleteModal.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          文章管理
        </h1>
        <p class="mt-1 text-slate-500">
          管理博客文章，发布后可在主站查看
        </p>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col justify-between gap-4 md:flex-row">
        <div class="flex flex-1 gap-4">
          <UInput
            v-model="searchQuery"
            placeholder="搜索文章..."
            icon="search"
            class="w-full md:w-80"
          />
          <USelectMenu
            v-model="selectedStatus"
            :items="[
              { label: '全部状态', value: '' },
              { label: '已发布', value: 'published' },
              { label: '草稿', value: 'draft' },
            ]"
            value-key="value"
            placeholder="筛选状态"
            clearable
            class="w-40"
          />
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="selectedPosts.length > 0"
            color="red"
            variant="soft"
            @click="openBatchDeleteModal"
          >
            🗑️ 删除选中 ({{ selectedPosts.length }})
          </UButton>
          <router-link
            to="/posts/create"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            ➕ 新建文章
          </router-link>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="w-12 px-4 py-3">
                <UCheckbox
                  :model-value="
                    selectedPosts.length === filteredPosts.length && filteredPosts.length > 0
                  "
                  :indeterminate="
                    selectedPosts.length > 0 && selectedPosts.length < filteredPosts.length
                  "
                  @update:model-value="selectedPosts = $event ? filteredPosts.map((p) => p.id) : []"
                />
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                标题
              </th>
              <th
                class="hidden px-4 py-3 text-left text-sm font-medium text-slate-700 md:table-cell"
              >
                分类
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                状态
              </th>
              <th
                class="hidden px-4 py-3 text-left text-sm font-medium text-slate-700 lg:table-cell"
              >
                浏览
              </th>
              <th
                class="hidden px-4 py-3 text-left text-sm font-medium text-slate-700 md:table-cell"
              >
                日期
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-slate-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="post in filteredPosts"
              :key="post.id"
              class="transition-colors hover:bg-slate-50"
            >
              <td class="px-4 py-3">
                <UCheckbox
                  :model-value="selectedPosts.includes(post.id)"
                  @update:model-value="
                    selectedPosts = $event
                      ? [...selectedPosts, post.id]
                      : selectedPosts.filter((id) => id !== post.id)
                  "
                />
              </td>
              <td class="px-4 py-3">
                <div class="max-w-xs">
                  <p class="truncate font-medium text-slate-900">
                    {{ post.title }}
                  </p>
                  <p class="truncate text-sm text-slate-500">
                    {{ post.excerpt }}
                  </p>
                </div>
              </td>
              <td class="hidden px-4 py-3 md:table-cell">
                <span
                  class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                >
                  {{ post.category.name }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  :class="
                    post.status === 'published'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  "
                >
                  {{ getStatusLabel(post.status) }}
                </span>
              </td>
              <td class="hidden px-4 py-3 lg:table-cell">
                <span class="text-sm text-slate-600">{{ post.viewCount }}</span>
              </td>
              <td class="hidden px-4 py-3 md:table-cell">
                <span class="text-sm text-slate-600">
                  {{ formatDate(post.publishedAt || post.createdAt) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <router-link
                    :to="`/posts/${post.id}/edit`"
                    class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-blue-100"
                    title="编辑"
                  >
                    ✏️
                  </router-link>
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-100"
                    title="删除"
                    @click="openDeleteModal(post.id, post.title)"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPosts.length === 0" class="py-12 text-center">
        <div class="mx-auto mb-4 text-5xl">
          📄
        </div>
        <p class="mb-4 text-slate-500">
          暂无文章
        </p>
        <router-link
          to="/posts/create"
          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          ➕ 创建第一篇文章
        </router-link>
      </div>

      <!-- 底部统计 -->
      <div class="border-t border-slate-200 px-4 py-3">
        <span class="text-sm text-slate-500"> 共 {{ filteredPosts.length }} 篇文章 </span>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancelDelete" />
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
              确定要删除以下文章吗？
            </p>
            <p class="mb-6 truncate px-4 font-medium text-slate-700">
              "{{ deleteTargetTitle }}"
            </p>
            <p class="mb-6 text-sm text-red-500">
              此操作无法撤销
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="cancelDelete"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              @click="confirmDelete"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 批量删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showBatchDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancelBatchDelete" />
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
              <span class="font-bold text-red-500">{{ selectedPosts.length }}</span> 篇文章吗？
            </p>
            <p class="mb-6 text-sm text-red-500">
              此操作无法撤销
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="cancelBatchDelete"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              @click="confirmBatchDelete"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
