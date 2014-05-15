[[!initRedactor]]

[[!FormIt?
&hooks=`createResource`
&preHooks=`setParent`
&validate=`pagetitle:required`
]]

<h2>Create a new resource</h2>
[[!+fi.error_message:notempty=`<p>[[!+fi.error_message]]</p>`]]
<form class="form" action="[[~[[*id]]]]" method="post">
    <input type="hidden" name="nospam:blank" value="" />
    <input type="hidden" name="parent" value="[[!+fi.parent]]" />

    <label for="pagetitle"> Title: <span class="error">[[!+fi.error.pagetitle]]</span> </label>
    <input id="pagetitle" type="text" name="pagetitle" value="[[!+fi.pagetitle]]" /> <br />

    <label for="content"> Content: <span class="error">[[!+fi.error.content]]</span> </label>
    <textarea id="content" class="rd" name="content" rows="7" cols="55">[[!+fi.content]]</textarea><br />

    <label for="alias"> Alias: <span class="error">[[!+fi.error.alias]]</span> </label>
    <input id="alias" type="text" name="alias" value="[[!+fi.alias]]" /> <br />

    <label for="template"> Template: <span class="error">[[!+fi.error.template]]</span> </label>
    <select name="template">
        [[-[[!+fi.templateOptions]]]]
        [[+templateOptionsPlaceholder]]
    </select>

    <label for="class_key" class="checkbox">Is Weblink
        <input id="class_key" type="checkbox" name="class_key" value="modWebLink" [[!+fi.class_key:FormItIsChecked=`modWebLink`]] />
    </label>



    <br />

    <label for="published"> Published: <span class="error">[[!+fi.error.published]]</span> </label>
    <input id="published" type="checkbox" name="published" value="1" [[!+fi.published:FormItIsChecked=`1`]] />

    <label for="hidemenu"> Hide from menu: <span class="error">[[!+fi.error.hidemenu]]</span> </label>
    <input id="hidemenu" type="checkbox" name="hidemenu" value="1" [[!+fi.hidemenu:FormItIsChecked=`1`]] />


    <div class="form-buttons"><input type="submit" value="Save resource" /></div>

</form>