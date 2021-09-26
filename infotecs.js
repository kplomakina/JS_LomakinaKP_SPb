/* На GitHub https://github.com/kplomakina/JS_LomakinaKP_SPb.git */

"use strict";

function Init() {
    /**
     * Получение json.
     */
    var request = new XMLHttpRequest();
    request.open("GET", "infotecs.json");
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            /**
             * Преобразование json в js для дальнейшей работы с данными.
             */
            let people = JSON.parse(request.responseText);
            
            /**
             * Вызов функции вывода таблицы с данными по людям.
             */
            showPeople(people);

            /**
             * Переменная, задающая направление сортировки. 
             */
            let direction = 1;
            /**
             * Создание объекта для дальнейшей сортировки. Принцип сортировки описан в функциях, которые являются свойствами объекта. 
             */
            let sorting = {
                "lastName": function (people) {
                    people.sort(function (a, b) {
                        if (a.name.lastName > b.name.lastName) {
                            return direction;
                        } else if (a.name.lastName < b.name.lastName) {
                            return -1 * direction;
                        } else {
                            return 0;
                        }
                    });
                },
                "firstName": function (people) {
                    people.sort(function (a, b) {
                        if (a.name.firstName > b.name.firstName) {
                            return direction;
                        } else if (a.name.firstName < b.name.firstName) {
                            return -1 * direction;
                        } else {
                            return 0;
                        }
                    });
                },
                "about": function (people) {
                    people.sort(function (a, b) {
                        if (a.about > b.about) {
                            return direction;
                        } else if (a.about < b.about) {
                            return -1 * direction;
                        } else {
                            return 0;
                        }
                    });
                },
                "eyeColor": function (people) {
                    people.sort(function (a, b) {
                        if (a.eyeColor > b.eyeColor) {
                            return direction;
                        } else if (a.eyeColor < b.eyeColor) {
                            return -1 * direction;
                        } else {
                            return 0;
                        }
                    });
                }
            };

            /**
             * Сортировка. 
             */
            document.querySelectorAll("[data-sort]").forEach(function (el, i, heads) {
                el.addEventListener("click", function () {
                    /**
                     * Запонимаем, на каком элементе стоял атрибут data-order и значение атрибута. 
                     */
                    let order = this.getAttribute("data-order");
                    /**
                     * Убираем аттрибут data-order со всех элементов th. 
                     */
                    heads.forEach(function (th) {
                        th.removeAttribute("data-order");
                        th.classList.remove("sort-asc");
                        th.classList.remove("sort-desc");
                    });
                    /**
                     * Задаем атрибут data-order и его значение в зависимости от того, каким он был раньше, тем самым устанавливаем сортировку. 
                     */
                    if (order === null || order === "desc") {
                        this.setAttribute("data-order", "asc");
                        this.classList.add("sort-asc");
                        direction = 1;
                        sorting[this.dataset["key"]](people);
                    } else if (order === "asc") {
                        this.setAttribute("data-order", "desc");
                        this.classList.add("sort-desc");
                        direction = -1;
                        sorting[this.dataset["key"]](people);
                    }
                    showPeople(people);
                });
            });
        }
    };
    request.send(null);

    /**
     * Функция вывода таблицы с информацией по людям. Последовательно создается элемент html в памяти и вставляется в сам документ. 
     */
    function showPeople(people) {
        document.querySelector("#people-body").innerHTML = "";
        people.forEach(function (person) {
            let trPerson = document.createElement("tr");
            trPerson.setAttribute("href", "");
            trPerson.setAttribute("data-id", person.id);
            trPerson.addEventListener("click", updatePerson);
            let tdLastName = document.createElement("td");
            tdLastName.innerHTML = person.name.lastName;        
            trPerson.appendChild(tdLastName);
            let tdFirstName = document.createElement("td");
            tdFirstName.innerHTML = person.name.firstName;
            trPerson.appendChild(tdFirstName);
            let tdDesc = document.createElement("td");
            tdDesc.innerHTML = person.about;
            trPerson.appendChild(tdDesc);
            /**
             * Добавление класса, который будет оставлять две строки описания и добавлять многоточие в конце строки.
             */
            tdDesc.classList.add('truncate-text');

            let tdEyeColor = document.createElement("td");
            tdEyeColor.innerHTML = person.eyeColor;

            /**
             * Добавление div, который будет отвечать за отображение цвета глаз в зависимости от заданных данных.
             */
            let divEyeColor = document.createElement("div");
            if (tdEyeColor.innerHTML == "blue") {
                divEyeColor.classList.add('blue');
            } else if (tdEyeColor.innerHTML == "brown") {
                divEyeColor.classList.add('brown');
            } else if (tdEyeColor.innerHTML == "green") {
                divEyeColor.classList.add('green');
            } else {
                divEyeColor.classList.add('red');
            }
            tdEyeColor.appendChild(divEyeColor);
            trPerson.appendChild(tdEyeColor);

            document.querySelector("#people-body").appendChild(trPerson);
        });

        /**
         * Функция для изменения данных по человеку. 
         */
        function updatePerson(e) {
            e.preventDefault();
            /**
             * Отображаем div с полями. 
             */
            document.querySelector("#formUpdatePerson").removeAttribute("hidden");
            /**
             * Запоминаем id человека, информацию по которому необходимо отредактировать. 
             */
            let id = this.dataset['id'];
            let eyeColors = [];
            people.forEach(function (person) {
                if (eyeColors.indexOf(person.eyeColor) === -1) {
                    eyeColors.push(person.eyeColor);
                }
            });
            let optionsEyeColors = "";
            eyeColors.forEach(function (eyeColor) {
                optionsEyeColors += `<option value="${eyeColor}">${eyeColor}</option>`;
            });
            document.querySelector("#update-eyeColor").innerHTML = optionsEyeColors;
            people.forEach(function (person) {
                if (person.id === id) {
                    document.querySelector("#update-id").value = person.id;
                    document.querySelector("#update-last").value = person.name.lastName;
                    document.querySelector("#update-first").value = person.name.firstName;
                    document.querySelector("#update-about").value = person.about;
                    document.querySelector("#update-eyeColor").value = person.eyeColor;
                }
            });
        }
        /**
         * Сохраненеие изменений после редактирования и их отображение в общей таблице. 
         */
        document.querySelector("#update-person-save").addEventListener("click", function () {
            let id = document.querySelector("#update-id").value;
            people.forEach(function (person) {
                if (person.id === id) {
                    person.name.lastName = document.querySelector("#update-last").value;
                    person.name.firstName = document.querySelector("#update-first").value;
                    person.about = document.querySelector("#update-about").value;
                    person.eyeColor = document.querySelector("#update-eyeColor").value;
                }
            });
            document.querySelector("#formUpdatePerson").setAttribute("hidden", "hidden");
            showPeople(people);
        });
        /**
         * Обработчик события по закрытию полей для редактирования инормации без внесения изменений. 
         */
        document.querySelector("#update-person-close").addEventListener("click", function () {
            document.querySelector("#formUpdatePerson").setAttribute("hidden", "hidden");
        });
    };
}
window.addEventListener("load", Init);
