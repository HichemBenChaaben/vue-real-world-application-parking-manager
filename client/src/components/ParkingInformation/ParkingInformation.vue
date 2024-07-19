<template>
  <h2 class="text-xl font-semibold">Parking Information</h2>
  <div class="bg-gray-100 p-1 rounded-2">
    <div class="max-w-4xl mx-auto p-2">
      <div class="bg-white rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-3">Floor 1</h2>
        <p class="text-gray-700 mb-2">Parking spaces 1 – 75</p>
        <ul class="list-disc list-inside text-gray-600">
          <li>Space 1 – 50: Spaces used for residents of the building (no charge)</li>
          <li>Space 51 – 130: Cars <strong>€ 5,00</strong> per hour</li>
          <li>Space 131 – 150: Motorcycles <strong>€ 3,00</strong> per hour</li>
        </ul>
      </div>

      <div class="bg-white rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-3">Floor 2</h2>
        <p class="text-gray-700 mb-2">Parking spaces 76 – 150</p>
        <ul class="list-disc list-inside text-gray-600">
          <li>Space 1 – 50: Spaces used for residents of the building (no charge)</li>
          <li>Space 51 – 130: Cars <strong>€ 5,00</strong> per hour</li>
          <li>Space 131 – 150: Motorcycles <strong>€ 3,00</strong> per hour</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
