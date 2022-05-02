(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function yard() {
        function read() {
            return localStorage.yard ? JSON.parse(localStorage.yard) : [];
        }
        function add(vehicle, save) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.license}</td>
        <td>${vehicle.entered}</td>
        <td>
          <button class="delete" data-license="${vehicle.license}">X</button>
        </td>
      `;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remove(this.dataset.license);
            });
            (_b = $('#yard')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (save)
                register([...read(), vehicle]);
        }
        function register(vehicles) {
            localStorage.setItem('yard', JSON.stringify(vehicles));
        }
        function render() {
            $('#yard').innerHTML = '';
            const yard = read();
            if (yard.length) {
                yard.forEach((vehicle) => add(vehicle));
            }
        }
        function remove(license) {
            const { name, entered } = read().find(vehicle => vehicle.license === license);
            const time = calcTime(new Date().getTime() - new Date(entered).getTime());
            if (!confirm(`The vehicle ${name} stayed for ${time}. Do you want to finish?`))
                return;
            register(read().filter((vehicle) => vehicle.license !== license));
            render();
        }
        return { read, add, register, render, remove };
    }
    yard().render();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $('#name')) === null || _a === void 0 ? void 0 : _a.value;
        const license = (_b = $('#license')) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !license) {
            alert('The fields name and license plate are required!');
            return;
        }
        yard().add({ name, license, entered: new Date().toISOString() }, true);
    });
})();
