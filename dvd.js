$(document).ready(function () {
    function getDvds() {
        $.ajax({
            type: 'GET',
            url: ' http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
            success: function (dvds) {
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
                    var releaseYear = row.find('.releaseYear').text();
                    var director = row.find('.director').text();
                    var rating = row.find('.rating').text();
                    var notes = '';
                    
                });
                $('.editLink').on('click', function(e){
                    e.preventDefault();
                    var row = $(this).closest('tr');
                    var title = row.find('.title').text();
                    var releaseYear = row.find('.releaseYear').text();
                    var director = row.find('.director').text();
                    var rating = row.find('.rating').text();
                    var notes = '';
                    showEditForm(title, releaseYear, director, rating, notes);
                });


            },
            error: function () {
                console.log('FAILURE');
            }

        });
    }

    function clearFormValues (){
        $('#titleInput').val('');
        $('#releaseYear').val('');
        $('#directorInput').val('');
        $('#rating option').removeAttr('selected');
        $('#rating option[value="G"]').attr('selected', true); 
    }

    function showEditForm(title, releaseYear, director, rating, notes) {
        setFormValues(title, releaseYear, director, rating, notes);
        $('#headerTitle').text('Edit DVD: ' + title);
        $('#tableContainer').hide();
        $('#methodHeader').show();
        $('#formContainer').show();
    }

    function setFormValues(title, releaseYear, director, rating, notes){
        
        
        $('#titleInput').val(title);
        $('#releaseYear').val(releaseYear);
        $('#directorInput').val(director);
        $('#rating option').removeAttr('selected');
        $('#rating option[value=' + rating + ']').attr('selected', true);

    }

    function showCreateForm () {
        $('#tableContainer').hide();
        $('#headerTitle').text('Create DVD');
        $('#methodHeader').show();
        clearFormValues();
        $('#formContainer').show();
    }

    $("#createDVD").on('click', function(){
        showCreateForm();
    });

    $("#formBackBtn").on('click', function() {
        getDvds();
    });
    getDvds();
    
});