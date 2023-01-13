/* eslint-disable eqeqeq */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', (el, binding, _vnode) => {
    el.clickOutsideEvent = function (event: any) {
      // here I check that click was outside the el and his children

      if (!(el == event.target || el.contains(event.target))) {
        // if it did, call method provided in attribute value
        binding.value(event)
      }
    }
    document.body.addEventListener('mousedown', el.clickOutsideEvent)
  })
})
