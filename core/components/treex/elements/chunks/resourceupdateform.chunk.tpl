[[!initRedactor]]

[[!FormIt?
    &hooks=`updateResource`
    &preHooks=`fetchResource`
    &validate=`pagetitle:required`
]]

<h2>Update resource</h2>
[[!+fi.error_message:notempty=`<p>[[!+fi.error_message]]</p>`]]
<form class="form" action="[[~[[*id]]]]" method="post" enctype="multipart/form-data">
    <input type="hidden" name="nospam:blank" value="" />
    <input type="hidden" id="resource_id" name="resource_id" value="[[!+fi.resource_id]]" />
    <input type="hidden" id="context_key" name="context_key" value="[[!+fi.context_key]]" />
    
    <label for="pagetitle"> Title: <span class="error">[[!+fi.error.pagetitle]]</span> </label>
    <input id="pagetitle" type="text" name="pagetitle" value="[[!+fi.pagetitle]]" /> <br />

    <label for="content"> Content: <span class="error">[[!+fi.error.content]]</span> </label>
    <textarea id="content" name="content" rows="7" cols="55">[[!+fi.content]]</textarea><br />

    <label for="template"> Template: <span class="error">[[!+fi.error.template]]</span> </label>
    <select name="template">
        [[!+fi.templateOptions]]
    </select>

    <br />

    <label for="published"> Published: <span class="error">[[!+fi.error.published]]</span> </label>
    <input id="published" type="checkbox" name="published" value="1" [[!+fi.published:FormItIsChecked=`1`]] />

<br />

    [[- TV's ]]
    <input type="hidden" id="tvs" name="tvs" value="1" />

    <label for="tv1"> Page Image: <span class="error">[[!+fi.error.tv1]]</span> </label>
    <input id="tv1" type="file" name="tv1" value="[[!+fi.tv1]]" /> <br />

    <label for="tv2"> Page Image 2: <span class="error">[[!+fi.error.tv2]]</span> </label>
    <input id="tv2" type="file" name="tv2" value="[[!+fi.tv2]]" /> <br />

    <div class="form-buttons"><input type="submit" value="Save resource" /></div>
</form>
