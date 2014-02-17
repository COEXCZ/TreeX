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
    <input id="pagetitle" type="text" name="pagetitle" value="[[!+fi.pagetitle]]" style="min-width:50%" /> <br />

    <label for="content"> Content: <span class="error">[[!+fi.error.content]]</span> </label>
    <textarea id="content" name="content" rows="7" cols="55">[[!+fi.content]]</textarea><br />

    <label for="alias"> Alias: <span class="error">[[!+fi.error.alias]]</span> </label>
    <input id="alias" type="text" name="alias" value="[[!+fi.alias]]" /> <br />

    <label for="template"> Template: <span class="error">[[!+fi.error.template]]</span> </label>
    <select name="template">
        [[-[[!+fi.templateOptions]]]]
        [[+templateOptionsPlaceholder]]
    </select>

    <br />

    <label for="published"> Published: <span class="error">[[!+fi.error.published]]</span> </label>
    <input id="published" type="checkbox" name="published" value="1" [[!+fi.published:FormItIsChecked=`1`]] />

    <br />

    [[- TV's ]]
    <input type="hidden" id="tvs" name="tvs" value="1" />

    <label for="tv14"> Page Image 1: <span class="error">[[!+fi.error.tv14]]</span> </label>
    <input id="tv14" type="file" name="tv14" /> 
    [[!+fi.tv14:notempty=`
        <img src="[[!+fi.tv14:phpthumbof=`w=120&h=120`]]" />
        <label><input type="checkbox" name="delete[]" value="tv14" /> Delete</label>
    `]]
    <br />

    <label for="tv17"> Page Image 1 Caption: <span class="error">[[!+fi.error.tv17]]</span> </label>
    <input id="tv17" type="text" name="tv17" value="[[!+fi.tv17]]" /> 
    <br />

    <label for="tv15"> Page Image 2: <span class="error">[[!+fi.error.tv15]]</span> </label>
    <input id="tv15" type="file" name="tv15" /> 
    [[!+fi.tv15:notempty=`
        <img src="[[!+fi.tv15:phpthumbof=`w=120&h=120`]]" />
        <label><input type="checkbox" name="delete[]" value="tv15" /> Delete</label>
    `]]
    <br /> 

    <label for="tv18"> Page Image 2 Caption: <span class="error">[[!+fi.error.tv18]]</span> </label>
    <input id="tv18" type="text" name="tv18" value="[[!+fi.tv18]]" /> 
    <br /> 

    <label for="tv16"> Disqus Enabled: <span class="error">[[!+fi.error.tv16]]</span> </label>
    <input id="tv16" type="checkbox" name="tv16" value="$disqus" /> 
    <br />

    <div class="form-buttons"><input type="submit" value="Save resource" /></div>
</form>