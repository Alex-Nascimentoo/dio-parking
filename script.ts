interface IVehicle {
  name: string;
  license: string;
  entered: Date | string;
}

(function() {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

  function calcTime(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil % 60000) / 1000);

    return `${min}m e ${sec}s`;
  }

  function yard() {
    function read(): IVehicle[] {
      return localStorage.yard ? JSON.parse(localStorage.yard) : [];
    }

    function add(vehicle: IVehicle, save?: Boolean) {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.license}</td>
        <td>${vehicle.entered}</td>
        <td>
          <button class="delete" data-license="${vehicle.license}">X</button>
        </td>
      `;

      row.querySelector('.delete')?.addEventListener('click', function() {
        remove(this.dataset.license);
      })

      $('#yard')?.appendChild(row);

      if(save) register([...read(), vehicle]);
    }

    function register(vehicles: IVehicle[]) {
      localStorage.setItem('yard', JSON.stringify(vehicles));
    }

    function render() {
      $('#yard')!.innerHTML = '';
      const yard = read();

      if(yard.length) {
        yard.forEach((vehicle) => add(vehicle));
      }
    }

    function remove(license: string) {
      const { name, entered } = read().find(vehicle => vehicle.license === license);

      const time = calcTime(new Date().getTime() - new Date(entered).getTime());

      if(!confirm(`The vehicle ${name} stayed for ${time}. Do you want to finish?`)) return;

      register(read().filter((vehicle) => vehicle.license !== license));
      render();
    }

    return { read, add, register, render, remove };
  }

  yard().render();
  $("#register")?.addEventListener("click", () => {
    const name = $('#name')?.value;
    const license = $('#license')?.value;

    if(!name || !license) {
      alert('The fields name and license plate are required!');
      return;
    }

    yard().add({ name, license, entered: new Date().toISOString() }, true);
  })
})();