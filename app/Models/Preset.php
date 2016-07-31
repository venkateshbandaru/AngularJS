<?php
/**
 * Author: Paul Bardack paul.bardack@gmail.com http://paulbardack.com
 * Date: 23.02.16
 * Time: 19:30
 */

namespace App\Models;

/**
 * Class Preset
 *
 * @package App\Models
 * @property string $condition
 * @property string $value
 */
class Preset extends Base
{
    protected $visible = ['_id', 'condition', 'value'];

    protected $fillable = ['_id', 'condition', 'value'];

    protected $casts = [
        '_id' => 'string',
    ];
}
