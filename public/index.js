let savedNotes = Handlebars.compile(
    `
    {{#each notes}}
    <div class="note">
        <span class="input"><textarea class="border-0" data-id="{{ @index }}"> {{ this }}</textarea></span>
        <div class="d-flex justify-content-end w-100">
            <span class="delete" data-id="{{ @index }}"><i class="fas fa-times"></i></span>
        </div>
        <hr>
    </div>
    {{/each}}
    `
)

const reload = (notes) => {
    $("#savedNotes").html(savedNotes({
        notes: notes
    }))
}

$(function () {

    //Delete button
    $("body").on("click", ".delete", function () {
        let note = $(this).attr("data-id")
        axios
            .delete(`http://localhost:3000/api/notes/${note}`)
            .then((res) => {
                console.log("delete received")
                reload(res.data);
            })
            .catch((e) => {
                alert(e)
            })
    })

    //Update button
    $("#savedNotes").on("click", ".update", function () {
        let note = $(this).attr("data-id")
        let content = $(`[data-id=${note}]`).val()
        axios
            .put(`http://localhost:3000/api/notes/${note}`, {
                note: `${content}`
            })
            .then((res) => {
                console.log("update received")
                reload(res.data);
            })
            .catch((e) => {
                alert(e)
            })
    })

})