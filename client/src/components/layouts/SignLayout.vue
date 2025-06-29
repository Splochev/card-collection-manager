<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="w-full max-w-xl scoped-bg-white rounded-xl drop-shadow-2xl p-8 flex flex-col gap-2">
      <div class="text-center flex flex-col gap-2">
        <h1 class="text-2xl font-semibold scoped-text-900">
            {{ pageTitle }}
        </h1>
        <p class="text-md scoped-text-900">
          {{ linkText }}
          <SharedButton
            variant="link"
            :label="linkLabel"
            :path="linkPath"
          />
        </p>
      </div>
      <div class="flex flex-row justify-around items-center gap-4">
        <SharedButton
          variant="outlined"
          class="flex items-center justify-center px-8 py-4"
          @click="loginWithGoogle"
        >
          <GoogleIcon />
        </SharedButton>
        <SharedButton
          variant="outlined"
          class="flex items-center justify-center px-8 py-4"
          @click="loginWithApple"
        >
          <AppleIcon />
        </SharedButton>
        <SharedButton
          variant="outlined"
          class="flex items-center justify-center px-8 py-4"
          @click="loginWithLinkedIn"
        >
          <LinkedInIcon />
        </SharedButton>
        <SharedButton
          variant="outlined"
          class="flex items-center justify-center px-8 py-4"
          @click="loginWithX"
        >
          <XIcon />
        </SharedButton>
        <SharedButton
          variant="outlined"
          class="flex items-center justify-center px-8 py-4"
          @click="loginWithFacebook"
        >
          <FacebookIcon />
        </SharedButton>
      </div>
      <!-- <Divider align="center">OR</Divider> -->
        <slot />
    </div>
  </div>
</template>

<style scoped>
.scoped-text-900 {
  color: var(--p-text-900);
}

.scoped-bg-white {
  background-color: var(--p-primary-0);
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SharedButton from '@/components/shared/SharedButton.vue'
import GoogleIcon from '../icons/GoogleIcon.vue';
import AppleIcon from '../icons/AppleIcon.vue';
import LinkedInIcon from '../icons/LinkedInIcon.vue';
import XIcon from '../icons/XIcon.vue';
import FacebookIcon from '../icons/FacebookIcon.vue';

const route = useRoute();

const pageTitle = computed(() => route.path === '/signin' ? 'Sign in' : 'Sign up');
const linkText = computed(() => route.path === '/signin' ? 'Need an account?' : 'Already have an account?');
const linkLabel = computed(() => route.path === '/signin' ? 'Sign up' : 'Sign in');
const linkPath = computed(() => route.path === '/signin' ? '/signup' : '/signin');

// Social login handlers
const loginWithGoogle = () => {
  console.log('Login with Google');
  // TODO: Implement Google OAuth
};

const loginWithApple = () => {
  console.log('Login with Apple');
  // TODO: Implement Apple OAuth
};

const loginWithLinkedIn = () => {
  console.log('Login with LinkedIn');
  // TODO: Implement LinkedIn OAuth
};

const loginWithX = () => {
  console.log('Login with X');
  // TODO: Implement X OAuth
};

const loginWithFacebook = () => {
    console.log('Login with FB');
    // TODO: Implement FB OAuth
}
</script>
