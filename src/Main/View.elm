module Main.View exposing (mainView)

import Main.Types exposing (Model, Msg)
import Html exposing (Html, div, text)


mainView : Model -> Html Msg
mainView model =
    div [] [ text "Hello" ]
