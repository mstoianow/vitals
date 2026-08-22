function initCustomerAddressForms() {
  document.querySelectorAll('[data-address-form]').forEach((form) => {
    const countrySelect = form.querySelector('[data-country]');
    const provinceWrapper = form.querySelector('[data-province-wrapper]');
    const provinceSelect = form.querySelector('[data-province]');

    if (!countrySelect || !provinceSelect || !provinceWrapper) return;
    if (form.dataset.addressReady === 'true') return;
    form.dataset.addressReady = 'true';

    const defaultCountry = countrySelect.dataset.default;
    if (defaultCountry) countrySelect.value = defaultCountry;

    const renderProvinces = () => {
      const option = countrySelect.options[countrySelect.selectedIndex];
      let provinces = [];

      try {
        provinces = JSON.parse(option.getAttribute('data-provinces') || '[]');
      } catch (error) {
        provinces = [];
      }

      provinceSelect.innerHTML = '';

      if (provinces.length === 0) {
        provinceWrapper.hidden = true;
        return;
      }

      provinces.forEach((province) => {
        const entry = document.createElement('option');
        entry.value = province[0];
        entry.textContent = province[1];
        provinceSelect.appendChild(entry);
      });

      provinceWrapper.hidden = false;

      const defaultProvince = provinceSelect.dataset.default;
      if (defaultProvince) provinceSelect.value = defaultProvince;
    };

    countrySelect.addEventListener('change', renderProvinces);
    renderProvinces();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomerAddressForms);
} else {
  initCustomerAddressForms();
}

document.addEventListener('toggle', initCustomerAddressForms, true);
