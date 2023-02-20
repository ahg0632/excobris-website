

$('select').change(function () {
    let selectedFilter = $(this).attr('name');
    let bufferFilter = document.getElementById(selectedFilter);

    let idBuffer = $(this).attr('id');
    let selectedOption = $('#' + idBuffer).val();



    // The post request to this endpoint requires a "name" varialbe in the query
    fetch(`/api/pictures?name=${selectedOption}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
        .then(response => response.json())
        .then(data => {

            if (data.pictures.length != 0) {
                // Clear the group pictures
                bufferFilter.innerHTML = "";

                // Add first active picture into carousel.
                bufferFilter.innerHTML += `<div class="carousel-item active">
                    <img src="${data.pictures[0]}" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block"></div></div>`;

                // Add the remaining pictures into carousel.
                data.pictures.slice(1).forEach(item => {
                    bufferFilter.innerHTML += `<div class="carousel-item">
                    <img src="${item}" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block"></div></div>`
                });
            }
        })
    .catch(error => { console.error(error) });

});


// This makes a GET request. We don't need to pass variables.
fetch(`/api/getOptions`)
    .then(response => response.json())
    .then(data => { 

        data.groupDropdown.forEach(filIterator => {
            // console.log(filIterator);
            groupSelector.innerHTML += `<option value='${filIterator}'>${filIterator}</option>`
        });

        data.charDropdown.forEach(filIterator => {
            // console.log(filIterator);
            charSelector.innerHTML += `<option value='${filIterator}'>${filIterator}</option>`
        });
    })
.catch(error => { console.error(error) });