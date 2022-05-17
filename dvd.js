$(document).ready(function () {

    function appendDvdRows(dvds) {
        //remove all currently appended rows if any (empty also removes event handlers on those rows)
        $('#tableContainer tbody').empty();
        $('#tableContainer').show();
        $('#methodHeader').hide();
        $('#formContainer').hide();
        $('#detailsContainer').hide();
        // iterate through returned data array, append table rows containing parsed values
        for (var i = 0; i < dvds.length; i++) {
            var dvd = dvds[i];
            var tableRow = '<tr><td class="hidden id">' + dvd.id + '</td><td ><a class="titleLink" href="">' + dvd.title
                + '</a></td><td class="releaseYear">' + dvd.releaseYear + '</td><td class="director">'
                + dvd.director + '</td>' + '<td class="rating">' + dvd.rating
                + '</td><td> <a class="editLink" href="">Edit</a> | ' +
                '<a class="deleteLink" href="" data-toggle="modal" data-target="#deleteModal">Delete</a></td></tr>';
            // appends the row and returns the table body
            var tbody = $("#tableContainer tbody").append(tableRow);
            var appendedRow = tbody.find('tr:last-child');
            var titleAnchor = appendedRow.find('.titleLink');
            var editAnchor = appendedRow.find('.editLink');
            var deleteAnchor = appendedRow.find('.deleteLink');
            // add event handlers to all three links in the appended row
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
                var title = row.find('.titleLink').text();
                $('#deleteId').text(id);
                $('#deleteModalBody').text('Are you sure you want to delete ' + title + '?');
            });
        }
    }

    function getDvds() {
        $.ajax({
            type: 'GET',
            url: ' http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
            success: function (dvds) {
                appendDvdRows(dvds);
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

    function getByCategory(e) {
        e.preventDefault();
        var searchCategory = $('#searchCategory').find('option:selected').attr('value');
        var searchTerm = $('#searchTerm').val();

        if (searchCategory == "" || searchTerm == "") {
            $("#errorMsg").text("Both Search Category and Search Term are required");
            $("#errorMsgContainer").show(0).delay(3000).hide(0);
        }
        else {
            $.ajax({
                type: 'GET',
                url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/' + searchCategory + '/' + searchTerm,
                success: function (dvds) {
                    appendDvdRows(dvds);
                },
                error: function () {
                    console.log('FAILURE');
                }
            });
        }
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

    $('#createDVD').on('click', showCreateForm);

    $('#formBackBtn').on('click', getDvds);

    $('#detailsBackBtn').on('click', getDvds);

    $('#formSubmit').on('click', function () {
        if (!isValidFormInput()) {
            $("#errorMsgContainer").show().delay(3000).hide(0);
        } else {
            if ($('#id').attr('value') == '') {
                createDvd();
            } else {
                editDvd();
            }
        }
    });

    function isValidFormInput() {
        var year = $('#releaseYear').val();
        var title = $('#titleInput').val();
        if (isNaN(year) || year.length != 4) {
            $("#errorMsg").text("Please enter a 4-digit year");
            return false;
        }
        if (title == "") {
            $("#errorMsg").text("Please enter a title for the DVD");
            return false;
        }
        return true;
    }

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

    $('#search').on('submit', getByCategory);

    getDvds();
});