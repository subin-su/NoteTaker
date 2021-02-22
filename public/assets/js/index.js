var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");


let noteChange = {};

let sNote = function (note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

let gNote = function () {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};


let deleteNote = function (id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};


let renderActiveNote = function () {
  $saveNoteBtn.hide();

  if (typeof noteChange.id === "number") {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(noteChange.title);
    $noteText.val(noteChange.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};


let handleNoteSave = function () {
  let noteTaker = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  sNote(noteTaker);
  getAndRenderNotes();
  renderActiveNote();
};


let handleNoteDelete = function (event) {
 
  event.stopPropagation();

  var note = $(this).data("id");

  if (noteChange.id === note) {
    noteChange = {};
  }

  deleteNote(note);
  getAndRenderNotes();
  renderActiveNote();
};


let handleNoteView = function () {
  noteChange = $(this).data();
  renderActiveNote();
};


let handleNewNoteView = function () {
  noteChange = {};
  renderActiveNote();
};


let handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};


let renderNoteList = function (notes) {
  $noteList.empty();

  let noteListItems = [];

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    $li.data("id", i);

    let $span = $("<span>").text(note.title);
    let $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note' data-id=" +
        i +
        ">"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
let getAndRenderNotes = function () {
  return gNote().then(function (data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();