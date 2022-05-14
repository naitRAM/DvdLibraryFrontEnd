$(document).ready(function () {

    function getDvds() {
        $.ajax({
            type: 'GET',
            url: ' http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
            success: function (dvds) {
                $('#tableContainer tbody').empty();
                $('#tableContainer').show();
                $('#methodHeader').hide();
                $('#formContainer').hide();
                $('#detailsContainer').hide();
                for (var i = 0; i < dvds.length; i++) {
                    var dvd = dvds[i];
                    var tableRow = '<tr><td class="hidden id">' + dvd.id + '</td><td class="title"><a href="">' + dvd.title
                        + '</a></td><td class="releaseYear">' + dvd.releaseYear + '</td><td class="director">'
                        + dvd.director + '</td>' + '<td class="rating">' + dvd.rating
                        + '</td><td> <a class="editLink" href="">Edit</a> | ' +
                        '<a class="deleteLink" href="" data-toggle="modal" data-target="#deleteModal">Delete</a></td></tr>';
                    var tableBody = $("#tableContainer tbody").append(tableRow);
                    var titleAnchor = tableBody.find(':last-child .title a');
                    var editAnchor = tableBody.find(':last-child .editLink');
                    var deleteAnchor = tableBody.find(':last-child .deleteLink');
                    titleAnchor.on('click', function (e) {
                        e.preventDefault();
                        $.ajax({
                            type: 'GET',
                            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + $(this).closest('tr').find('.id').text(),
                            success: function (dvd) {
                                var title = dvd.title;
                                var releaseYear = dvd.releaseYear;
                                var director = dvd.director;
                                var rating = dvd.rating;
                                var notes = dvd.notes;
                                showDvdDetails(title, releaseYear, director, rating, notes);
                            }
                        })
                    });
                    editAnchor.on('click', function (e) {
                        e.preventDefault();
                        $.ajax({
                            type: 'GET',
                            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + $(this).closest('tr').find('.id').text(),
                            success: function (dvd) {
                                var title = dvd.title;
                                var releaseYear = dvd.releaseYear;
                                var director = dvd.director;
                                var rating = dvd.rating;
                                var notes = dvd.notes;
                                var id = dvd.id;
                                showEditForm(id, title, releaseYear, director, rating, notes);
                            }
                        })
                    });
                    deleteAnchor.on('click', function (e) {
                        e.preventDefault();
                        var row = $(this).closest('tr');
                        var id = row.find('.id').text();
                        var title = row.find('.title a').text();
                        $('#deleteId').text(id);
                        $('#deleteModalBody').text('Are you sure you want to delete ' + title + '?');
                    });
                }
            },
            error: function () {
                console.log('FAILURE');
            }
        });
    }

    function editDvd() {
        $.ajax({
            type: 'PUT',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + $('#id').attr('value'),
            data: JSON.stringify({
                dvdId: $('#id').attr('value'),
                title: $('#titleInput').val(),
                releaseYear: $('#releaseYear').val(),
                director: $('#directorInput').val(),
                rating: $('#rating option:selected').val(),
                notes: $('#notes').val()
            }),
            contentType: 'application/json',
            success: function () {
                getDvds();
            },
            error: function () {
                console.log("things fall apart");
            }
        });
    }

    function createDvd() {
        $.ajax({
            type: 'POST',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/',
            data: JSON.stringify({
                title: $('#titleInput').val(),
                releaseYear: $('#releaseYear').val(),
                director: $('#directorInput').val(),
                rating: $('#rating option:selected').val(),
                notes: $('#notes').val()
            }),
            contentType: 'application/json',
            success: function () {
                getDvds();
            },
            error: function () {
                console.log("erratum");
            }
        });
    }

    function clearFormValues() {
        $('#id').attr('value', '');
        $('#titleInput').val('');
        $('#releaseYear').val('');
        $('#directorInput').val('');
        $('#rating option').removeAttr('selected');
        $('#rating option[value="G"]').attr('selected', true);
        $('#notes').val('');
    }

    function showEditForm(id, title, releaseYear, director, rating, notes) {
        setFormValues(id, title, releaseYear, director, rating, notes);
        $('#headerTitle').text('Edit DVD: ' + title);
        $('#tableContainer').hide();
        $('#methodHeader').show();
        $('#formContainer').show();
    }

    function showDvdDetails(title, releaseYear, director, rating, notes) {
        $('#headerTitle').text(title);
        $('#detailsReleaseYear').text(releaseYear);
        $('#detailsDirector').text(director);
        $('#detailsRating').text(rating);
        $('#detailsNotes').text(notes);
        $('#methodHeader').show();
        $('#tableContainer').hide();
        $('#detailsContainer').show();

    }

    function setFormValues(id, title, releaseYear, director, rating, notes) {
        $('#id').attr('value', id);
        $('#titleInput').val(title);
        $('#releaseYear').val(releaseYear);
        $('#directorInput').val(director);
        $('#rating option').removeAttr('selected');
        $('#rating option[value=' + rating + ']').attr('selected', true);
        $('#notes').val(notes);
    }

    function showCreateForm() {
        $('#tableContainer').hide();
        $('#headerTitle').text('Create DVD');
        $('#methodHeader').show();
        clearFormValues();
        $('#formContainer').show();
    }

    $('#createDVD').on('click', function () {
        showCreateForm();
    });

    $('#formBackBtn').on('click', function () {
        getDvds();
    });

    $('#detailsBackBtn').on('click', function () {
        getDvds();
    });

    $('#formSubmit').on('click', function () {
        if ($('#id').attr('value') == '') {
            createDvd();
        } else {
            editDvd();
        }
    });

    $('#deleteBtn').on('click', function () {
        var id = $(this).find('#deleteId').text();
        $.ajax({
            type: 'DELETE',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + id,
            success: function () {
                $('#deleteModal').modal('hide');
                getDvds();
            }
        })
    });

    getDvds();

});