'use strict';
'require view';
'require form';

return view.extend({
  render: function() {
    var map = new form.Map('termix', _('Termix Theme'),
      _('Choose the appearance of the LuCI interface. Apply the changes and reload the page to see the new palette.'));
    var section = map.section(form.NamedSection, 'settings', 'theme', _('Appearance'));
    section.anonymous = true;

    var mode = section.option(form.ListValue, 'mode', _('Color mode'));
    mode.value('dark', _('Dark'));
    mode.value('light', _('Light'));
    mode.value('system', _('Follow system'));
    mode.default = 'dark';

    var accent = section.option(form.ListValue, 'accent', _('Accent color'));
    [
      ['orange', _('Orange')], ['blue', _('Blue')], ['green', _('Green')],
      ['purple', _('Purple')], ['pink', _('Pink')], ['cyan', _('Cyan')],
      ['red', _('Red')], ['yellow', _('Yellow')], ['teal', _('Teal')],
      ['indigo', _('Indigo')], ['rose', _('Rose')], ['lime', _('Lime')],
      ['custom', _('Custom')]
    ].forEach(function(choice) { accent.value(choice[0], choice[1]); });
    accent.default = 'orange';

    var custom = section.option(form.Value, 'custom_accent', _('Custom color (hex)'));
    custom.placeholder = '#f59145';
    custom.depends('accent', 'custom');
    custom.validate = function(sectionId, value) {
      return /^#[0-9a-f]{6}$/i.test(value) || _('Enter a color in #RRGGBB format.');
    };

    return map.render();
  }
});
