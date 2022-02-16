<template>
    <div 
        v-if="isLoading"
        class="row spinner"
        data-testid="spinner"
    >
        <div class="col text-center">
            <div
                class="spinner-border text-primary" 
                role="status" 
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isLoading: {
            type: Boolean,
            default() {
                return false;
            }
        },
    }
}
</script>