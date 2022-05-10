$(document).ready(function () {
    function getDvds() {
        $.ajax({
            type: 'GET',
            url: ' http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
            success: function (dvds) {
                console.log(dvds);
                $('#tableContainer').show();
                $('#methodHeader').hide();
                $('#formContainer').hide();
                for (var i=0; i < dvds.length; i++) {
                    var dvd = dvds[i];
                    var tableRow = '<tr><td class="title"><a href="">' + dvd.title
                    + '</a></td><td class="releaseYear">' + dvd.releaseYear + '</td><td class="director">'
                    + dvd.director + '</td>' + '<td class="rating">' + dvd.rating 
                    + '</td><td> <a class="editLink" href="">Edit</a> | ' + 
                    '<a class="deleteLink" href="">Delete</a></td></tr>';
                    $("#tableContainer tbody").append(tableRow);
                }
                $('.title a').on('click', function(e) {
                    e.preventDefault();
                    var row = $(this).closest('tr');
                    var title = $(this).text();
                    var releaseYear = row.find(".releaseYear").text();
                    var director = row.find(".director").text();
                    var rating = row.find(".rating").text();
                    console.log(title + " " + releaseYear + " " + director + " " + rating);
                });

            },
            error: function () {
                console.log('FAILURE');
            }

        });
    }
    getDvds();
});