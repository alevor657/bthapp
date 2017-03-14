#!/bin/env bash

function usage {
    local txt=(
"cli made to test nodejs server"
""
"Use argument --test to begin tests"
"--verbose option prints servers response"
"Observe that verbose option must be given first!"
""
)

printf "%s\n" "${txt[@]}"
}

function version {
    local version="1.0.0"

    printf "%s\n" "$version"
}

function setPort {
    if [[ ${LINUX_PORT+x} ]]; then
        echo "$LINUX_PORT"
    else
        echo 1337
    fi
}

function setServer {
    if [[ ${LINUX_SERVER+x} ]]; then
        echo "$LINUX_SERVER"
    else
        echo localhost
    fi
}

PORT=$(setPort)
SERVER=$(setServer)
verbose=""


function testServer {
    URLs=(
    "$SERVER:$PORT/"
    "$SERVER:$PORT/room/list"
    "$SERVER:$PORT/room/list?max=3"
    "$SERVER:$PORT/room/list?max=33"
    "$SERVER:$PORT/room/view/id/G319-A"
    "$SERVER:$PORT/room/view/id/G319-B"
    "$SERVER:$PORT/room/view/house/G-huset"
    "$SERVER:$PORT/room/view/house/H-huset"
    "$SERVER:$PORT/room/search/kar"
    "$SERVER:$PORT/room/searchp/7"
    "$SERVER:$PORT/room/searchp/upp"
    "$SERVER:$PORT/room/searchp/F"
    "$SERVER:$PORT/room/searchp/06C"
    "$SERVER:$PORT/room/searchp/HuSeT"
    "$SERVER:$PORT/room/searchp/SOMERANDOMSTRING"
    )

    for (( i = 0; i < ${#URLs[@]}; i++ )); do
        echo "URL:"
        echo "${URLs[$i]}"
        echo "HEAD:"
        curl -v ${URLs[$i]} 2>&1 | grep Content-Type
        echo ""
        if [[ "$verbose" = true ]]; then
            curl -s "${URLs[$i]}"
            echo ""
        fi
        echo "=============================================="
    done
}

#
# Process options
#
while (( $# ))
do
    case "$1" in

        --help | -h)
            usage
            exit 0
        ;;

        --version | -v)
            version
            exit 0
        ;;

        --verbose)
            verbose=true
            shift
            # continue
            # exit 0
        ;;

        --test)
            # command=$1
            # shift
            # app-"$command" "$@"
            # exit 0
            testServer "$verbose"
            exit 0
        ;;

        *)
            badUsage "Option/command not recognized."
            exit 1
        ;;

    esac
done


usage
exit 1


# echo "$PORT"
# echo "$SERVER"
