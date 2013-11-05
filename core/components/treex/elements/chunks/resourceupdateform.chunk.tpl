[[!initRedactor]]

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
    <input type="hidden" id="context_key" name="context_key" value="[[!+fi.context_key]]" />
    
    <label for="pagetitle"> Title: <span class="error">[[!+fi.error.pagetitle]]</span> </label>
    <input id="pagetitle" type="text" name="pagetitle" value="[[!+fi.pagetitle]]" /> <br />

    <label for="content"> Content: <span class="error">[[!+fi.error.content]]</span> </label>
    <textarea id="content" name="content" rows="7" cols="55">[[!+fi.content]]</textarea><br />

    <label for="published"> Published: <span class="error">[[!+fi.error.published]]</span> </label>
    <input id="published" type="checkbox" name="published" value="1" [[!+fi.published:FormItIsChecked=`1`]] />


    <div class="form-buttons"><input type="submit" value="Save resource" /></div>
</form>
