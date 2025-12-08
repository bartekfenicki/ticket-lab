<template>
  <section class="p-6 md:p-12  min-h-screen">
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-8">Contact Us</h1>

    <div class="flex flex-col lg:flex-row gap-8">

      <div class="lg:w-1/3 bg-green-100 p-6 rounded-lg shadow space-y-4">
        <h2 class="text-xl font-semibold mb-2">Get in touch</h2>
        <p>We’d love to hear from you! Reach out via email, phone, or drop by our office.</p>

        <div class="space-y-2">
          <p><strong>Email:</strong> <a href="mailto:contact@example.com" class="text-indigo-600">contact@example.com</a></p>
          <p><strong>Phone:</strong> <a href="tel:+1234567890" class="text-indigo-600">+1 234 567 890</a></p>
          <p><strong>Address:</strong> 123 Main St, City, Country</p>
        </div>
      </div>

      <div class="lg:w-2/3 flex flex-col gap-6">

        <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 class="text-xl font-semibold mb-2">Send us a message</h2>

          <input
            v-model="form.name"
            type="text"
            placeholder="Your Name"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            v-model="form.email"
            type="email"
            placeholder="Your Email"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <textarea
            v-model="form.message"
            placeholder="Your Message"
            rows="4"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>

          <button
            type="submit"
            class="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Send Message
          </button>

          <p v-if="successMessage" class="text-green-600 mt-2">{{ successMessage }}</p>
        </form>

        <div class="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-center">
          Map will go here
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  message: ''
});

const successMessage = ref('');

const submitForm = () => {
  console.log('Form submitted:', form.value);
  successMessage.value = 'Your message has been sent!';
  form.value = { name: '', email: '', message: '' };
};
</script>


