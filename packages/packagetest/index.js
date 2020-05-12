import PackageTest from './src/main.vue'
PackageTest.install = function (Vue) {
    Vue.component(PackageTest.name, PackageTest)
}
export default PackageTest