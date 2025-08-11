<template>
    <!-- Course Merge Placeholder -->
</template>
<script>
import { useVuelidate } from "@vuelidate/core";

export default {
    name: "CourseMerge",
    components: {
        CourseReview,
    },
    setup() {
        return { v$: useVuelidate() };
    },

};
</script>
