import modalDetail from './modalDetail.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'maroon5';
//參考範例
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});
// 參考範例完
Vue.createApp({
  data() {
    return {
      products: [],
      product:{},
      cart:{},
      loadingStatus: {
        loadingItem: '',
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  created() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios.get(url).then((response) => {
        if (response.data.success) {
          this.products = response.data.products;
        } else {
          alert(response.data.message);
        }
      }).catch(error=>{
        console.log(error);
      });
    },
    getProduct(id){
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        if (response.data.success) {
          this.loadingStatus.loadingItem = '';
          this.product = response.data.product;
          this.$refs.modalDetail.openModal();
        } else {
          alert(response.data.message);
        }
      }).catch(error=>{
        console.log(error);
      });
    },
    addCart(id,qty = 1){
      const url = `${apiUrl}/api/${apiPath}/cart`;
      const cart = {
        product_id: id,
        qty
      };
      this.loadingStatus.loadingItem = id;
      this.$refs.modalDetail.hideModal();
      axios.post(url,{data:cart}).then(response => {
        if(response.data.success){
          this.loadingStatus.loadingItem = '';
          alert(response.data.message);
          this.getCart();
        }else{
          alert(response.data.message);

        }
      }).catch(error=>{
        console.log(error);
      })
    },
    getCart(){
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then(response=>{
        if(response.data.success){
          this.cart = response.data.data;
        }else{
          alert(response.data.message);
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    delCartItem(id){
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url).then(response=>{
        if(response.data.success){
          this.loadingStatus.loadingItem = '';
          alert(response.data.message);
          this.getCart(); 
        }else{
          alert(response.data.message)
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    delCartAll(){
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then(response=>{
        if(response.data.success){
          alert(response.data.message)
          this.getCart();  
        }else{
          alert(response.data.message)
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    updateCart(data){
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
      const cart = {
        product_id: data.product_id,
        qty:data.qty
      };
      this.loadingStatus.loadingItem = data.id;
      axios.put(url,{data: cart}).then(response=>{
        if(response.data.success){
          this.loadingStatus.loadingItem = '';
          alert(response.data.message)
          this.getCart();  
        }else{
          alert(response.data.message)
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    createOrder() { //參考範例
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.$refs.form.resetForm();
          console.log(response.data);
          this.getCart();
        } else {
          alert(response.data.message)
        }
      }).catch(error=>{
        console.log(error);
      });
    },
  },
})
.component('modalDetail', modalDetail)
.mount('#app');
