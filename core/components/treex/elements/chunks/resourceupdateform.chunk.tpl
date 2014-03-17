[[!TreeXCheckPolicy:is=`1`:then=`

[[!initRedactor]]

[[!FormIt?
&hooks=`updateResource`
&preHooks=`fetchResource`
&validate=`pagetitle:required`
]]

[[!+fi.error_message:notempty=`<p>[[!+fi.error_message]]</p>`]]
<form class="form" action="[[~[[*id]]]]" method="post" enctype="multipart/form-data">
    <input type="hidden" name="nospam:blank" value="" />
    <input type="hidden" id="resource_id" name="resource_id" value="[[!+fi.resource_id]]" />
    <input type="hidden" id="context_key" name="context_key" value="[[!+fi.context_key]]" />

    <label for="pagetitle">Page Title: <span class="error">[[!+fi.error.pagetitle]]</span> </label>
    <input id="pagetitle" type="text" name="pagetitle" value="[[!+fi.pagetitle]]" style="min-width:50%" /> <br />

    <label for="content"> Content: <span class="error">[[!+fi.error.content]]</span> </label>
    <textarea id="content" name="content" class="rd" rows="7" cols="55">[[!+fi.content]]</textarea><br />

    <table class="table">
        <tbody>
        <tr>
            <td>
                <label for="published" class="checkbox"> published<span class="error">[[!+fi.error.published]]</span>
                    <input id="published" type="checkbox" name="published" value="1" [[!+fi.published:FormItIsChecked=`1`]] />
                </label>
            </td>
            <td>
                <label for="tv16" class="checkbox"> comments enabled<span class="error">[[!+fi.error.tv16]]</span>
                    <input id="tv16" type="checkbox" name="tv16" value="1" [[!+fi.tv16:FormItIsChecked=`1`]] />
                </label>
            </td>
        </tr>
        <tr>
            <td>
                <label for="hidemenu" class="checkbox">Hide from menu<span class="error">[[!+fi.error.hidemenu]]</span>
                    <input id="hidemenu" type="checkbox" name="hidemenu" value="1" [[!+fi.hidemenu:FormItIsChecked=`1`]] />
                </label>
            </td>
            <td>

            </td>
        </tr>
        <tr>
            <td>
                <label for="alias"><span class="error">[[!+fi.error.alias]]</span> </label>
                <div class="input-prepend">
                    <span class="add-on">Alias:</span>
                    <input id="alias" type="text" name="alias" value="[[!+fi.alias]]" />
                </div>
            </td>
            <td>
            </td>
        </tr>
        <tr>
            [[- TV's ]]
            <input type="hidden" id="tvs" name="tvs" value="1" />
            <td>
                <label for="tv14"> Left Image: <span class="error">[[!+fi.error.tv14]]</span> </label>
                <input id="tv14" type="file" name="tv14" />
                [[!+fi.tv14:notempty=`
                <img src="[[!+fi.tv14:phpthumbof=`w=120&h=120`]]" />
                <label><input type="checkbox" name="delete[]" value="tv14" /> Delete</label>
                `]]
                <br />

                <label for="tv17"><span class="error">[[!+fi.error.tv17]]</span> </label>
                <div class="input-prepend">
                    <span class="add-on">Caption</span>
                    <input id="tv17" type="text" name="tv17" value="[[!+fi.tv17]]" />
                </div>

            </td>
            <td>
                <label for="tv15"> Right Image: <span class="error">[[!+fi.error.tv15]]</span> </label>
                <input id="tv15" type="file" name="tv15" />
                [[!+fi.tv15:notempty=`
                <img src="[[!+fi.tv15:phpthumbof=`w=120&h=120`]]" />
                <label><input type="checkbox" name="delete[]" value="tv15" /> Delete</label>
                `]]
                <br />

                <label for="tv18"><span class="error">[[!+fi.error.tv18]]</span> </label>
                <div class="input-prepend">
                    <span class="add-on">Caption</span>
                    <input id="tv18" type="text" name="tv18" value="[[!+fi.tv18]]" />
                </div>
            </td>
        </tr>
        </tbody>
    </table>
    <label for="tv43"> Custom CSS: <span class="error">[[!+fi.error.tv43]]</span> </label>
    <textarea id="tv43" name="tv43" rows="8" class="span12">
        [[!+fi.tv43]]
    </textarea>
    <br />
    <div class="form-buttons"><input type="submit" value="save resource" class="btn btn-primary" /></div>
</form>

`:else=`<div>You have no permissions to edit this resource.</div>`]]