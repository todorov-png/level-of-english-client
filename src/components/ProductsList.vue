<template>
  <Accordion v-if="true" :multiple="true" :activeIndex="[0]">
    <template v-for="(product, key) in products" :key="key">
      <AccordionTab :header="product[0].product">
        <Carousel
          :value="product"
          :numVisible="3"
          :numScroll="3"
          :responsiveOptions="responsiveOptions"
        >
          <template #item="slotProps">
            <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
              <div class="overflow-auto max-h-30rem mb-3">
                <img :src="pathScreenshotsDesktop(slotProps.data._id)" class="w-full" alt="" />
              </div>
              <div>
                <h4 class="mb-1">{{ slotProps.data.country }}</h4>
                <!-- <h6 class="mt-0 mb-3">${{ slotProps.data.price }}</h6> -->
                <!-- <Tag
                  :value="slotProps.data.inventoryStatus"
                  :severity="getSeverity(slotProps.data.inventoryStatus)"
                /> -->
                <div class="mt-5">
                  <Button icon="pi pi-search" rounded class="mr-2" />
                  <Button icon="pi pi-star-fill" rounded severity="success" class="mr-2" />
                </div>
              </div>
            </div>
          </template>
        </Carousel>
        <!-- <Galleria
          :value="product"
          :circular="true"
          containerStyle="max-width: 640px; margin: 0 auto;"
          :showItemNavigators="true"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <div class="overflow-auto max-h-30rem">
              <img :src="pathScreenshotsDesktop(slotProps.item._id)" class="w-full" alt="" />
            </div>
          </template>
        </Galleria> -->
      </AccordionTab>
    </template>
  </Accordion>
</template>

<script>
  import Accordion from 'primevue/accordion';
  import AccordionTab from 'primevue/accordiontab';
  import Carousel from 'primevue/carousel';
  import Button from 'primevue/button';
  // import Galleria from 'primevue/galleria';
  import { mapActions } from 'vuex';

  export default {
    components: {
      Accordion,
      AccordionTab,
      Carousel,
      Button,
      // Galleria
    },
    data() {
      return {
        responsiveOptions: [
          {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 3,
          },
          {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 2,
          },
          {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1,
          },
        ],
      };
    },

    created() {
      this.getData();
    },

    computed: {
      products() {
        return this.$store.state.products || {};
      },
      env() {
        return process.env;
      },
    },

    methods: {
      ...mapActions(['getLands']),

      async getData() {
        const response = await this.getLands();
        if (!response.success) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('TOAST.SUMMARY.ERROR'),
            detail: response.messageError,
            life: 3000,
          });
        }
      },

      pathScreenshotsDesktop(id) {
        return `${this.env.VUE_APP_SCREENSHOTS_URL}/${id}/desktop.webp`;
      },
    },
  };
</script>

<style lang="scss">
  .p-galleria .p-galleria-item-nav:not(.p-disabled) {
    background-color: black !important;
  }
</style>
