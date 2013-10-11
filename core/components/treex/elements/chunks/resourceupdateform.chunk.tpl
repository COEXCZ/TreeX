[[!FormIt?
    &hooks=`updateResource`
    &preHooks=`fetchResource`
    &validate=`pagetitle:required`
]]

<h2>Update resource</h2>
[[!+fi.error_message:notempty=`<p>[[!+fi.error_message]]</p>`]]
<form class="form" action="[[~[[*id]]]]" method="post">
    <input type="hidden" name="nospam:blank" value="" />
    <input type="hidden" id="resource_id" name="resource_id" value="[[!+fi.resource_id]]" />

    <label for="name"> Title: <span class="error">[[!+fi.error.pagetitle]]</span> </label>
    <input id="pagetitle" type="text" name="pagetitle" value="[[!+fi.pagetitle]]" /> <br />

    <label for="text"> Content: <span class="error">[[!+fi.error.content]]</span> </label>
    <textarea id="content" name="content" rows="7" cols="55">[[!+fi.content]]</textarea>
    <div class="form-buttons"><input type="submit" value="Save resource" /></div>
</form>
