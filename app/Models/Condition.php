<?php
/**
 * Author: Paul Bardack paul.bardack@gmail.com http://paulbardack.com
 * Date: 15.02.16
 * Time: 17:40
 */

namespace App\Models;

/**
 * Class Condition
 * @package App\Models
 * @property string $field_key
 * @property string $condition
 * @property string $value
 * @property bool $matched
 * @property integer $probability
 * @property integer $requests
 */
class Condition extends Base
{
    protected $visible = ['_id', 'field_key', 'condition', 'value', 'probability', 'requests'];

    protected $fillable = ['_id', 'field_key', 'condition', 'value'];

    public function setFieldKeyAttribute($value)
    {
        $this->attributes['field_key'] = strtolower(str_replace(' ', '_', trim($value)));
    }
}
