function zebra(zeb, ra) {
  return seq(optional(ra), (repeat(seq(zeb, ra))), optional(zeb));
}
module.exports = grammar({
  name: 'typst',
  // extras: $ => [$.comment],
  extras: $ => [],
  inline: $ => [$._sl_expr, $._ml_expr, $._terminated, $._any_normal, $._any_strong, $._any_emph],
  conflicts: $ => [
    [$._sl_5, $._sl_mul],
    [$._sl_5, $._sl_mul, $._sl_div],
    [$._sl_instr, $._sl_add],
    [$._sl_instr, $._sl_assign],
    [$._sl_instr, $._sl_sub],
    [$._sl_instr, $._sl_add, $._sl_sub],
    [$._sl_instr, $._sl_add, $._sl_mul],
    [$._sl_add, $._sl_mul],
    [$._sl_sub, $._sl_mul, $._sl_div],
    [$._sl_sub, $._sl_mul],
    [$._sl_add, $._sl_mul, $._sl_div],
    [$._sl_add, $._sl_let],
    [$._sl_add, $._sl_sub, $._sl_let],
    [$._sl_add, $._sl_sub, $._sl_cmp, $._sl_6],
    [$._sl_add, $._sl_sub, $._sl_cmp],
    [$._sl_add, $._sl_sub, $._sl_in],
    [$._sl_branch, $._sl_condition],
    [$._sl_let],
    [$._sl_set],
    [$._sl_let, $._sl_in],
    [$._sl_import],
    [$._sl_instr, $._sl_in],
    [$._sl_7, $._sl_in],
    [$._sl_and, $._sl_in],
    [$._sl_and, $._sl_or],
    [$._sl_8, $._sl_and],
    [$._sl_not, $._sl_and],
    [$._sl_expr, $._sl_or],
    [$._sl_assign, $._sl_or],
    [$._sl_assign, $._sl_let],
    [$._sl_expr, $._sl_assign],
    [$._sl_assign, $._sl_instr, $._sl_lambda],
    [$._sl_assign, $._sl_let, $._sl_lambda],
    [$._sl_lambda, $._sl_or],
    [$._sl_9, $._sl_or],
    [$._sl_elude],
    [$._sl_elude, $._sl_or],


    [$._ml_5, $._ml_mul],
    [$._ml_5, $._ml_mul, $._ml_div],
    [$._ml_instr, $._ml_add],
    [$._ml_instr, $._ml_sub],
    [$._ml_instr, $._ml_add, $._ml_sub],
    [$._ml_instr, $._ml_add, $._ml_mul],
    [$._ml_add, $._ml_mul],
    [$._ml_sub, $._ml_mul, $._ml_div],
    [$._ml_sub, $._ml_mul],
    [$._ml_add, $._ml_mul, $._ml_div],
    [$._ml_add, $._ml_let],
    [$._ml_add, $._ml_sub, $._ml_let],
    [$._ml_add, $._ml_sub, $._ml_cmp, $._ml_6],
    [$._ml_add, $._ml_sub, $._ml_cmp],
    [$._ml_add, $._ml_sub, $._ml_in],
    [$._ml_branch, $._ml_condition],
    [$._ml_let],
    [$._ml_let, $._ml_in],
    [$._ml_import],
    [$._ml_instr, $._ml_in],
    [$._ml_instr, $._ml_assign],
    [$._ml_7, $._ml_in],
    [$._ml_and, $._ml_in],
    [$._ml_and, $._ml_or],
    [$._ml_8, $._ml_and],
    [$._ml_not, $._ml_and],
    [$._ml_expr, $._ml_or],
    [$._ml_assign, $._ml_or],
    [$._ml_assign, $._list_elem],
    [$._ml_assign, $.tagged],
    [$._ml_assign, $._ml_let],
    [$._ml_assign, $._ml_instr, $._ml_lambda],
    [$._ml_assign, $._ml_let, $._ml_lambda],
    [$._ml_lambda, $._ml_or],
    [$._ml_expr, $._ml_assign],
    [$._ml_9, $._ml_or],
    [$._ml_elude],
    [$._ml_elude, $._ml_or],

    [$._item, $._0],
    [$._item, $._sl_1],
    [$._item, $._sl_2],
    [$._space_lp],
    [$._space_lp, $._normal_tail_condition_line],
  ],
  rules: {
    source_file: $ => optional(choice(
      $._normal_tail_any_space,
      $._normal_tail_any_text,
      $._any_normal,
    )),

    comment: $ => choice(
      seq('//', /[^\n]*\n?/),
      seq('/*', /([^\*]|\*[^\/])*/, '*/'),
    ),
    escape: $ => /\\./,
    _text_any: $ => choice(
      /[^# \t\n\]\*_\\\$]/,
      /[a-zA-Z0-9][_\*][a-zA-Z0-9]/,
      $.escape,
    ),
    _text_next_space: $ => repeat1($._text_any),
    _text_next_item: $ => choice('.', seq(/(\.[^a-zA-Z \t\n_\$])|[^\.# \t\n\[\*\]\(_;\$]/, repeat($._text_any))),
    _text_next_condition: $ => seq(/(\.[^a-zA-Z]|else[^ \t\n\*\+\!\(\{;\$]|els[^e]|el[^s]|e[^l]|[^e# \t\n\(\[\*\]\.\$])/, repeat($._text_any)),
    _space_l0: $ => repeat1(/[ \t]/),
    _space_l1: $ => /\n/,
    _space_lp: $ => seq($._space_l1, repeat1(seq(optional($._space_l0), $._space_l1))),
    _space_la: $ => prec.right(choice(
      seq($._space_l0, optional(seq(choice($._space_l1, $._space_lp), optional($._space_l0)))),
      seq(choice($._space_l1, $._space_lp), optional($._space_l0)),
    )),
    raw: $ => seq('```', field('lang', optional($.ident)), alias(/[^`a-zA-Z](``[^`]|`[^`]|[^`])*/, $.blob), '```'),
    math: $ => seq('$', /[^\$]*/, '$'),

    _any_normal: $ => choice(
      $._normal_tail_any_line,
      $._normal_tail_any_break,
      $._normal_tail_any_code,
      $._normal_tail_any_strong,
      $._normal_tail_any_emph,
      $._normal_tail_any_raw,
      $._normal_tail_any_math,
    ),
    _any_strong: $ => choice(
      $._strong_tail_any_line,
      $._strong_tail_any_code,
      $._strong_tail_any_emph,
      $._strong_tail_any_raw,
      $._strong_tail_any_math,
    ),
    _any_emph: $ => choice(
      $._emph_tail_any_line,
      $._emph_tail_any_code,
      $._emph_tail_any_strong,
      $._emph_tail_any_raw,
      $._emph_tail_any_math,
    ),
    _any_normal_space: $ => choice(
      $._normal_tail_any_space,
      $._normal_tail_any_code,
      $._normal_tail_any_strong,
      $._normal_tail_any_emph,
      $._normal_tail_any_raw,
      $._normal_tail_any_math,
    ),
    _any_strong_space: $ => choice(
      $._strong_tail_any_space,
      $._strong_tail_any_code,
      $._strong_tail_any_emph,
      $._strong_tail_any_raw,
      $._strong_tail_any_math,
    ),
    _any_emph_space: $ => choice(
      $._emph_tail_any_space,
      $._emph_tail_any_code,
      $._emph_tail_any_strong,
      $._emph_tail_any_raw,
      $._emph_tail_any_math,
    ),

    // TAIL ANY
    _normal_tail_any_space: $ => seq($._space_l0, optional(choice(
      $._normal_tail_any_text,
      $._any_normal,
    ))),
    _normal_tail_any_text: $ => seq(alias($._text_next_space, $.text), optional(choice(
      $._normal_tail_any_space,
      $._any_normal,
    ))),
    _normal_tail_any_strong: $ => seq($.strong, optional(choice(
      $._normal_tail_any_space,
      $._normal_tail_any_text,
      $._any_normal,
    ))),
    _normal_tail_any_raw: $ => seq($.raw, optional(choice(
      $._normal_tail_any_space,
      $._normal_tail_any_text,
      $._any_normal,
    ))),
    _normal_tail_any_math: $ => seq($.math, optional(choice(
      $._normal_tail_any_space,
      $._normal_tail_any_text,
      $._any_normal,
    ))),
    _strong_tail_any_space: $ => seq($._space_l0, optional(choice(
      $._strong_tail_any_text,
      $._any_strong,
    ))),
    _strong_tail_any_text: $ => seq(alias($._text_next_space, $.text), optional(choice(
      $._strong_tail_any_space,
      $._any_strong,
    ))),
    _strong_tail_any_raw: $ => seq($.raw, optional(choice(
      $._strong_tail_any_space,
      $._strong_tail_any_text,
      $._any_strong,
    ))),
    _strong_tail_any_math: $ => seq($.math, optional(choice(
      $._strong_tail_any_space,
      $._strong_tail_any_text,
      $._any_strong,
    ))),
    _emph_tail_any_space: $ => seq($._space_l0, optional(choice(
      $._emph_tail_any_text,
      $._any_emph,
    ))),
    _emph_tail_any_text: $ => seq(alias($._text_next_space, $.text), optional(choice(
      $._emph_tail_any_space,
      $._any_emph,
    ))),
    _emph_tail_any_raw: $ => seq($.raw, optional(choice(
      $._emph_tail_any_space,
      $._emph_tail_any_text,
      $._any_emph,
    ))),
    _emph_tail_any_math: $ => seq($.math, optional(choice(
      $._emph_tail_any_space,
      $._emph_tail_any_text,
      $._any_emph,
    ))),

    // TAIL LINE
    _normal_tail_any_line: $ => seq($._space_l1, optional($._space_l0), optional(choice(
      $._normal_tail_any_text,
      $._normal_tail_any_code,
      $._normal_tail_any_strong,
      $._normal_tail_any_emph,
      $._normal_tail_any_raw,
      $._normal_tail_any_math,
    ))),
    _normal_tail_any_break: $ => seq(alias($._space_lp, $.break), optional($._space_l0), optional(choice(
      $._normal_tail_any_text,
      $._normal_tail_any_code,
      $._normal_tail_any_strong,
      $._normal_tail_any_emph,
      $._normal_tail_any_raw,
      $._normal_tail_any_math,
    ))),
    _strong_tail_any_line: $ => seq($._space_l1, optional(choice(
      $._strong_tail_any_text,
      $._strong_tail_any_code,
      $._strong_tail_any_emph,
      $._strong_tail_any_raw,
      $._strong_tail_any_math,
    ))),
    _emph_tail_any_line: $ => seq($._space_l1, optional(choice(
      $._emph_tail_any_text,
      $._emph_tail_any_code,
      $._emph_tail_any_strong,
      $._emph_tail_any_raw,
      $._emph_tail_any_math,
    ))),

    // TAIL ITEM
    _normal_tail_item_text: $ => seq(alias($._text_next_item, $.text), optional(choice(
      $._normal_tail_any_space,
      $._any_normal,
    ))),
    _strong_tail_item_text: $ => seq(alias($._text_next_item, $.text), optional(choice(
      $._strong_tail_any_space,
      $._any_strong,
    ))),
    _emph_tail_item_text: $ => seq(alias($._text_next_item, $.text), optional(choice(
      $._emph_tail_any_space,
      $._any_emph,
    ))),

    // TAIL CONDITION
    _normal_tail_condition_space: $ => seq($._space_l0, optional(choice(
      $._normal_tail_condition_line,
      $._normal_tail_condition_break,
      $._normal_tail_condition_text,
      $._normal_tail_any_code,
      $._normal_tail_any_strong,
      $._normal_tail_any_emph,
    ))),
    _normal_tail_condition_break: $ => seq(alias($._space_lp, $.break), optional(choice(
      $._normal_tail_condition_space,
      $._normal_tail_condition_text,
      $._normal_tail_any_code,
      $._normal_tail_any_strong,
      $._normal_tail_any_emph,
    ))),
    _normal_tail_condition_line: $ => seq($._space_l1, optional(choice(
      $._normal_tail_condition_space,
      $._normal_tail_condition_text,
      $._normal_tail_any_code,
      $._normal_tail_any_strong,
      $._normal_tail_any_emph,
    ))),
    _normal_tail_condition_text: $ => seq(alias($._text_next_condition, $.text), optional(choice(
      $._normal_tail_any_space,
      $._any_normal,
    ))),
    _strong_tail_condition_space: $ => seq($._space_l0, optional(choice(
      $._strong_tail_condition_line,
      $._strong_tail_condition_text,
      $._strong_tail_any_code,
      $._strong_tail_any_emph,
    ))),
    _strong_tail_condition_line: $ => seq($._space_l1, optional(choice(
      $._strong_tail_condition_space,
      $._strong_tail_condition_text,
      $._strong_tail_any_code,
      $._strong_tail_any_emph,
    ))),
    _strong_tail_condition_text: $ => seq(alias($._text_next_condition, $.text), optional(choice(
      $._strong_tail_any_space,
      $._any_strong,
    ))),
    _emph_tail_condition_space: $ => seq($._space_l0, optional(choice(
      $._emph_tail_condition_line,
      $._emph_tail_condition_text,
      $._emph_tail_any_code,
      $._emph_tail_any_strong,
    ))),
    _emph_tail_condition_line: $ => seq($._space_l1, optional(choice(
      $._emph_tail_condition_space,
      $._emph_tail_condition_text,
      $._emph_tail_any_code,
      $._emph_tail_any_strong,
    ))),
    _emph_tail_condition_text: $ => seq(alias($._text_next_condition, $.text), optional(choice(
      $._emph_tail_any_space,
      $._any_emph,
    ))),

    // STRONG
    strong: $ => seq('*', choice(
      $._strong_tail_any_space,
      $._strong_tail_any_text,
      $._any_strong,
    ), '*'),
    _normal_tail_any_strong: $ => seq($.strong, optional(choice(
      $._normal_tail_any_text,
      $._normal_tail_any_space,
      $._any_normal,
    ))),
    _emph_tail_any_strong: $ => seq($.strong, optional(choice(
      $._emph_tail_any_text,
      $._emph_tail_any_space,
      $._any_emph,
    ))),

    // EMPH
    emph: $ => seq('_', choice(
      $._emph_tail_any_space,
      $._emph_tail_any_text,
      $._any_emph,
    ), '_'),
    _normal_tail_any_emph: $ => seq($.emph, optional(choice(
      $._normal_tail_any_space,
      $._normal_tail_any_text,
      $._any_normal,
    ))),
    _strong_tail_any_emph: $ => seq($.emph, optional(choice(
      $._strong_tail_any_text,
      $._strong_tail_any_space,
      $._any_strong,
    ))),

    // CODE
    _normal_tail_any_code: $ => seq('#', choice(
      seq($._item, optional(choice(
        seq(';', optional(choice(
          $._normal_tail_any_text,
          $._normal_tail_any_space,
          $._any_normal,
        ))),
        $._normal_tail_item_text,
        $._normal_tail_any_space,
        $._any_normal,
      ))),
      seq(alias($._sl_condition, $.condition), optional(choice(
        $._normal_tail_condition_space,
        $._normal_tail_condition_line,
        $._normal_tail_condition_break,
        $._normal_tail_condition_text,
        $._normal_tail_any_code,
        $._normal_tail_any_strong,
        $._normal_tail_any_emph,
      ))),
      seq($._terminated, optional(choice(
        $._normal_tail_any_line,
        $._normal_tail_any_break,
        seq(';', optional(choice(
          $._normal_tail_any_text,
          $._normal_tail_any_space,
          $._any_normal,
        ))),
      ))),
    )),
    _strong_tail_any_code: $ => seq('#', choice(
      seq($._item, optional(choice(
        seq(';', optional(choice(
          $._strong_tail_any_text,
          $._strong_tail_any_space,
          $._any_strong,
        ))),
        $._strong_tail_item_text,
        $._any_strong_space,
      ))),
      seq(alias($._sl_condition, $.condition), optional(choice(
        $._strong_tail_condition_text,
        $._any_strong_space,
      ))),
      seq($._terminated, optional(choice(
        $._strong_tail_any_line,
        seq(';', optional(choice(
          $._strong_tail_any_text,
          $._strong_tail_any_space,
          $._any_strong,
        ))),
      ))),
    )),
    _emph_tail_any_code: $ => seq('#', choice(
      seq($._item, optional(choice(
        seq(';', optional(choice(
          $._emph_tail_any_text,
          $._emph_tail_any_space,
          $._any_emph,
        ))),
        $._emph_tail_item_text,
        $._any_emph_space,
      ))),
      seq(alias($._sl_condition, $.condition), optional(choice(
        $._emph_tail_condition_text,
        $._any_emph_space,
      ))),
      seq($._terminated, optional(choice(
        $._emph_tail_any_line,
        seq(';', optional(choice(
          $._emph_tail_any_text,
          $._emph_tail_any_space,
          $._any_emph,
        ))),
      ))),
    )),


    _terminated: $ => choice(
      alias($._sl_let, $.let),
      alias($._sl_set, $.set),
      alias($._sl_import, $.import),
    ),

    _item: $ => choice(
      $.builtin,
      $.flow,
      $.bool,
      $.ident,
      $.int,
      $.float,
      $.string,
      alias($._sl_field, $.field),
      $.group,
      $.content,
      $.block,
      alias($._sl_branch, $.branch),
      alias($._sl_call, $.call),
      alias($._sl_for, $.for),
      alias($._sl_while, $.while),
    ),

    // PRECEDENCES
    _0: $ => choice(
      $.builtin,
      $.flow,
      $.bool,
      $.ident,
      $.int,
      $.float,
      $.string,
      $.group,
      $.content,
      $.block,
    ),
    _ml_1: $ => choice(
      $._0,
      alias($._ml_branch, $.branch),
      alias($._ml_condition, $.condition),
      alias($._ml_field, $.field),
      alias($._ml_for, $.for),
      alias($._ml_while, $.while),
    ),
    _sl_1: $ => choice(
      $._0,
      alias($._sl_branch, $.branch),
      alias($._sl_condition, $.condition),
      alias($._sl_field, $.field),
      alias($._sl_for, $.for),
      alias($._sl_while, $.while),
    ),
    _ml_2: $ => choice(
      $._ml_1,
      alias($._ml_call, $.call),
    ),
    _sl_2: $ => choice(
      $._sl_1,
      alias($._sl_call, $.call),
    ),
    _ml_3: $ => choice(
      $._ml_2,
      alias($._ml_sign, $.sign),
    ),
    _sl_3: $ => choice(
      $._sl_2,
      alias($._sl_sign, $.sign),
    ),
    _ml_4: $ => choice(
      $._ml_3,
      alias($._ml_mul, $.mul),
      alias($._ml_div, $.div),
    ),
    _sl_4: $ => choice(
      $._sl_3,
      alias($._sl_mul, $.mul),
      alias($._sl_div, $.div),
    ),
    _ml_5: $ => choice(
      $._ml_4,
      alias($._ml_add, $.add),
      alias($._ml_sub, $.sub),
    ),
    _sl_5: $ => choice(
      $._sl_4,
      alias($._sl_add, $.add),
      alias($._sl_sub, $.sub),
    ),
    _ml_6: $ => choice(
      $._ml_5,
      alias($._ml_cmp, $.cmp),
      alias($._ml_in, $.in),
    ),
    _sl_6: $ => choice(
      $._sl_5,
      alias($._sl_cmp, $.cmp),
      alias($._sl_in, $.in),
    ),
    _ml_7: $ => choice(
      $._ml_6,
      alias($._ml_not, $.not),
      alias($._ml_and, $.and),
    ),
    _sl_7: $ => choice(
      $._sl_6,
      alias($._sl_not, $.not),
      alias($._sl_and, $.and),
    ),
    _ml_8: $ => choice(
      $._ml_7,
      alias($._ml_or, $.or),
    ),
    _sl_8: $ => choice(
      $._sl_7,
      alias($._sl_or, $.or),
    ),
    _ml_9: $ => choice(
      $._ml_8,
      alias($._ml_elude, $.elude),
      alias($._ml_assign, $.assign),
      alias($._ml_lambda, $.lambda),
    ),
    _sl_9: $ => choice(
      $._sl_8,
      alias($._sl_elude, $.elude),
      alias($._sl_assign, $.assign),
      alias($._sl_lambda, $.lambda),
    ),
    _ml_expr: $ => $._ml_9,
    _sl_expr: $ => $._sl_9,
    _ml_instr: $ => choice(
      $._ml_expr,
      alias($._ml_let, $.let),
      alias($._ml_set, $.set),
      alias($._ml_import, $.import),
    ),
    _sl_instr: $ => choice(
      $._sl_expr,
      alias($._sl_let, $.let),
      alias($._sl_set, $.set),
      alias($._sl_import, $.import),
    ),

    // EXPRETIONS
    _list_elem: $ => choice(
      $._ml_instr,
      $.tagged,
    ),
    group: $ => seq(
      '(',
      repeat(seq(optional($._space_la), $._list_elem, optional($._space_la), ',')),
      optional($._space_la),
      optional(seq($._list_elem, optional($._space_la))),
      ')'
    ),
    block: $ => seq(
      '{',
      repeat(choice(
        $._space_l1,
        ';',
        seq(optional($._space_l0), optional(seq($._sl_instr, optional($._space_l0))), choice($._space_l1, ';')),
      )),
      optional(seq(optional($._space_l0), optional(seq($._sl_instr, optional($._space_l0))))),
      '}'
    ),
    content: $ => seq(
      '[',
      optional(choice(
        $._normal_tail_any_space,
        $._normal_tail_any_text,
        $._any_normal,
      )),
      ']',
    ),
    ident: $ => /[a-zA-Z_][a-zA-Z0-9_\-]*/,
    flow: $ => choice('break', 'continue'),
    builtin: $ => choice(
      'auto',
      'none',
      // 'center',
      // 'horizon',
      // 'top',
      // 'bottom',
      // 'left',
      // 'right',
    ),
    bool: $ => choice('true', 'false'),
    unit: $ => choice('cm', 'mm', 'em', '%', 'fr', 'pt'),
    int: $ => seq(/[0-9]+/, optional($.unit)),
    float: $ => seq(/[0-9]+\.[0-9]+/, optional($.unit)),
    string: $ => /"([^\"\\]|\\.)*"/,
    // string: $ => seq('"', repeat(choice(/[^\"\\]/, $.escape)), '"'),
    // string: $ => seq('"', optional($._string_tail), token.immediate('"')),
    // _string_tail: $ => seq(
    //   choice(token.immediate(/[^\"\\]/), alias(token.immediate(/\\./), $.escape)),
    //   optional($._string_tail)
    // ),
    tagged: $ => seq(field('field', $.ident), ':', optional($._space_la), $._ml_instr),

    _sl_assign: $ => seq($._sl_9, optional($._space_l0), choice('=', '+=', '-=', '*=', '/='), optional($._space_l0), $._sl_8),
    _ml_assign: $ => seq($._ml_9, optional($._space_la), choice('=', '+=', '-=', '*=', '/='), optional($._space_la), $._ml_8),

    _sl_lambda: $ => seq(field('pattern', $._sl_9), optional($._space_l0), '=>', optional($._space_l0), field('value', $._sl_8)),
    _ml_lambda: $ => seq(field('pattern', $._ml_9), optional($._space_la), '=>', optional($._space_la), field('value', $._ml_8)),

    _sl_not: $ => seq('not', optional($._space_l0), $._sl_7),
    _ml_not: $ => seq('not', optional($._space_la), $._ml_7),

    _sl_and: $ => seq($._sl_7, optional($._space_l0), 'and', optional($._space_l0), $._sl_6),
    _ml_and: $ => seq($._ml_7, optional($._space_la), 'and', optional($._space_la), $._ml_6),

    _sl_or: $ => seq($._sl_8, optional($._space_l0), 'or', optional($._space_l0), $._sl_7),
    _ml_or: $ => seq($._ml_8, optional($._space_la), 'or', optional($._space_la), $._ml_7),

    _sl_in: $ => seq($._sl_6, optional($._space_l0), optional(seq('not', $._space_l0)), 'in', optional($._space_l0), $._sl_5),
    _ml_in: $ => seq($._ml_6, optional($._space_la), optional(seq('not', $._space_la)), 'in', optional($._space_la), $._ml_5),

    _sl_cmp: $ => seq($._sl_5, optional($._space_l0), choice('<', '<=', '==', '>=', '>', '!='), optional($._space_l0), $._sl_5),
    _ml_cmp: $ => seq($._ml_5, optional($._space_la), choice('<', '<=', '==', '>=', '>', '!='), optional($._space_la), $._ml_5),

    _sl_add: $ => seq($._sl_5, optional($._space_l0), '+', optional($._space_l0), $._sl_4),
    _ml_add: $ => seq($._ml_5, optional($._space_la), '+', optional($._space_la), $._ml_4),

    _sl_sub: $ => seq($._sl_5, optional($._space_l0), '-', optional($._space_l0), $._sl_4),
    _ml_sub: $ => seq($._ml_5, optional($._space_la), '-', optional($._space_la), $._ml_4),

    _sl_mul: $ => seq($._sl_4, optional($._space_l0), '*', optional($._space_l0), $._sl_3),
    _ml_mul: $ => seq($._ml_4, optional($._space_la), '*', optional($._space_la), $._ml_3),

    _sl_div: $ => seq($._sl_4, optional($._space_l0), '/', optional($._space_l0), $._sl_3),
    _ml_div: $ => seq($._ml_4, optional($._space_la), '/', optional($._space_la), $._ml_3),

    _sl_sign: $ => seq(choice('+', '-'), optional($._space_l0), $._sl_3),
    _ml_sign: $ => seq(choice('+', '-'), optional($._space_la), $._ml_3),

    _sl_call: $ => seq(field('item', $._sl_2), choice($.group, $.content)),
    _ml_call: $ => seq(field('item', $._ml_2), choice($.group, $.content)),

    _sl_field: $ => seq($._sl_2, '.', field('field', $.ident)),
    _ml_field: $ => seq($._ml_2, '.', field('field', $.ident)),

    _sl_elude: $ => seq('..', optional($._space_l0), optional($._sl_8)),
    _ml_elude: $ => seq('..', optional($._space_la), optional($._ml_8)),

    _sl_for: $ => seq(
      'for',
      optional($._space_l0),
      field('pattern', $._0),
      optional($._space_l0),
      'in',
      optional($._space_l0),
      field('value', $._sl_expr),
      choice(
        seq($._space_l0, choice($.block, $.content)),
        $.block,
      ),
    ),
    _ml_for: $ => seq(
      'for',
      optional($._space_la),
      field('pattern', $._0),
      optional($._space_la),
      'in',
      optional($._space_la),
      field('value', $._ml_expr),
      choice(
        seq($._space_la, choice($.block, $.content)),
        $.block,
      ),
    ),

    _sl_while: $ => seq(
      'while',
      optional($._space_l0),
      field('test', $._sl_expr),
      choice(
        seq($._space_l0, choice($.block, $.content)),
        $.block,
      ),
    ),
    _ml_while: $ => seq(
      'while',
      optional($._space_la),
      field('test', $._ml_expr),
      choice(
        seq($._space_la, choice($.block, $.content)),
        $.block,
      ),
    ),

    _sl_branch: $ => seq(
      'if',
      optional($._space_l0),
      field('test', $._sl_expr),
      choice(
        seq($._space_l0, choice($.block, $.content)),
        $.block,
      ),
      optional($._space_la),
      'else',
      optional($._space_l0),
      choice($.block, $.content, $._sl_branch, $._sl_condition),
    ),
    _ml_branch: $ => seq(
      'if',
      optional($._space_la),
      field('test', $._ml_expr),
      choice(
        seq($._space_la, choice($.block, $.content)),
        $.block,
      ),
      optional($._space_la),
      'else',
      optional($._space_la),
      choice($.block, $.content, $._ml_branch, $._ml_condition),
    ),

    _sl_condition: $ => seq(
      'if',
      optional($._space_l0),
      field('test', $._sl_expr),
      choice(
        seq($._space_l0, choice($.block, $.content)),
        $.block,
      ),
    ),
    _ml_condition: $ => seq(
      'if',
      optional($._space_la),
      field('test', $._ml_expr),
      choice(
        seq($._space_la, choice($.block, $.content)),
        $.block,
      ),
    ),

    _sl_let: $ => seq(
      'let',
      optional($._space_l0),
      field('pattern', $._sl_2),
      optional($._space_l0),
      '=',
      optional($._space_l0),
      field('value', $._sl_expr),
      optional($._space_l0),
    ),
    _ml_let: $ => seq(
      'let',
      optional($._space_la),
      field('pattern', $._ml_2),
      optional($._space_la),
      '=',
      optional($._space_la),
      field('value', $._ml_expr),
    ),

    _sl_set: $ => seq(
      'set',
      optional($._space_l0),
      alias($._sl_call, $.call),
      optional($._space_l0),
    ),
    _ml_set: $ => seq(
      'set',
      optional($._space_la),
      alias($._ml_call, $.call),
    ),

    _sl_import: $ => seq(
      choice('import', 'include'),
      optional($._space_l0),
      $.string,
      optional($._space_l0),
      optional(seq(
        ':',
        seq(
          repeat(seq(optional($._space_l0), $.ident, optional($._space_l0), ',')),
          optional(seq(optional($._space_l0), $.ident))
        ),
      )),
      optional($._space_l0),
    ),
    _ml_import: $ => seq(
      choice('import', 'include'),
      optional($._space_la),
      $.string,
      optional($._space_la),
      optional(seq(
        ':',
        seq(
          repeat(seq(optional($._space_la), $.ident, optional($._space_la), ',')),
          optional(seq(optional($._space_la), $.ident))
        ),
      )),
    ),
  }
});

