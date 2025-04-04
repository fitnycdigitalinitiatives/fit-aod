<?php

namespace OmekaTheme\Helper;

use Laminas\View\Helper\AbstractHelper;
use Omeka\Api\Representation\ItemRepresentation;

class CitationHelper extends AbstractHelper
{
  public function __invoke(ItemRepresentation $item)
  {
    $escape = $this->getView()->plugin('escapeHtml');
    $title = $item->displayTitle();
    $date = $item->value('dcterms:date');
    $apaDate = $date;
    if (strlen($apaDate) == 10) {
      if (date_create($apaDate)) {
        $apaDate = date_format(date_create($apaDate), "Y, F j");
      }
    } elseif (strlen($apaDate) == 7) {
      $apaDate = date_format(date_create($apaDate), "Y, F");
    }
    $mlaDate = $date;
    if (strlen($mlaDate) == 10) {
      if (date_create($mlaDate)) {
        $mlaDate = date_format(date_create($mlaDate), "j M. Y");
      }
    } elseif (strlen($apaDate) == 7) {
      $mlaDate = date_format(date_create($mlaDate), "M. Y");
    }
    if (str_contains($mlaDate, "May.")) {
      $mlaDate = str_replace("May.", "May", $mlaDate);
    }
    $chicagoDate = $date;
    if (strlen($chicagoDate) == 10) {
      if (date_create($chicagoDate)) {
        $chicagoDate = date_format(date_create($chicagoDate), "F j, Y");
      }
    } elseif (strlen($apaDate) == 7) {
      $chicagoDate = date_format(date_create($chicagoDate), "F Y");
    }
    $url = $escape($item->url());
    $apa = 'Fashion Institute of Technology. (' . $apaDate . '). <em>' . $title . '</em> [Video]. Archive on Demand. ' . $url;
    $chicago = 'Fashion Institute of Technology, "' . $title . '," <em>Archive on Demand</em>, ' . $chicagoDate . ', video, ' . $url;
    $mla = 'Fashion Institute of Technology. "' . $title . '." <em>Archive on Demand</em>, ' . $mlaDate . ', ' . $url;
    return '
        <ul class="nav nav-underline mb-3" id="citationTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active text-dark" id="apa-tab" data-bs-toggle="tab" data-bs-target="#apa" type="button" role="tab" aria-controls="apa" aria-selected="true">APA</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link text-dark" id="mla-tab" data-bs-toggle="tab" data-bs-target="#mla" type="button" role="tab" aria-controls="mla" aria-selected="false">MLA</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link text-dark" id="chicago-tab" data-bs-toggle="tab" data-bs-target="#chicago" type="button" role="tab" aria-controls="chicago" aria-selected="false">Chicago/Turabian</button>
          </li>
        </ul>
        <div class="tab-content" id="citationTabContent">
          <div class="tab-pane fade show active" id="apa" role="tabpanel" aria-labelledby="apa-tab">
            <div class="input-group mb-3">
              <div class="form-control font-monospace text-break" id="apaCitation">
              ' . str_replace('..', '.', $apa) . '
              </div>
              <button class="btn btn-dark rounded-0 clip-button" type="button" id="apa-button" data-clipboard-target="#apaCitation" aria-label="Copy citation to clipboard">
                <i class="fas fa-copy" title="Copy citation to clipboard" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="tab-pane fade" id="mla" role="tabpanel" aria-labelledby="mla-tab">
          <div class="input-group mb-3">
            <div class="form-control font-monospace text-break" id="mlaCitation">
            ' . str_replace('..', '.', $mla) . '
            </div>
            <button class="btn btn-dark rounded-0 clip-button" type="button" id="mla-button" data-clipboard-target="#mlaCitation" aria-label="Copy citation to clipboard">
              <i class="fas fa-copy" title="Copy citation to clipboard" aria-hidden="true"></i>
            </button>
          </div>
          </div>
          <div class="tab-pane fade" id="chicago" role="tabpanel" aria-labelledby="chicago-tab">
          <div class="input-group mb-3">
            <div class="form-control font-monospace text-break" id="chicagoCitation">
            ' . str_replace('..', '.', $chicago) . '
            </div>
            <button class="btn btn-dark rounded-0 clip-button" type="button" id="chicago-button" data-clipboard-target="#chicagoCitation" aria-label="Copy citation to clipboard">
              <i class="fas fa-copy" title="Copy citation to clipboard" aria-hidden="true"></i>
            </button>
          </div>
          </div>
        </div>

        ';
  }
  // Converts $title to Title Case, and returns the result.
  protected function titleCase($title)
  {
    $smallwordsarray = array(
      'of',
      'a',
      'the',
      'and',
      'an',
      'or',
      'nor',
      'but',
      'is',
      'if',
      'then',
      'else',
      'when',
      'at',
      'from',
      'by',
      'on',
      'off',
      'for',
      'in',
      'out',
      'over',
      'to',
      'into',
      'with'
    );

    // Split the string into separate words
    $words = explode(' ', $title);

    foreach ($words as $key => $word) {
      // If this word is the first, or it's not one of our small words, capitalise it
      // with ucwords().
      if ($key == 0 or !in_array($word, $smallwordsarray)) {
        $words[$key] = ucwords($word);
      }
    }

    // Join the words back into a string
    $newtitle = implode(' ', $words);

    return $newtitle;
  }
}
