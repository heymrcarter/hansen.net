Param(
    [Parameter(Mandatory=$true)] $imgDir,
    [Parameter(Mandatory=$true)] $destDir
)

function ResizeImage {
    Param (
        [Parameter(Mandatory=$True)] [ValidateNotNull()] $imageSource,
        [Parameter(Mandatory=$True)] [ValidateNotNull()] $imageTarget,
        [Parameter(Mandatory=$True)] [ValidateNotNull()] $width,
        [Parameter(Mandatory=$True)] [ValidateNotNull()] $height,
        [Parameter(Mandatory=$true)] [ValidateNotNull()] $quality
    )
 
    if (!(Test-Path $imageSource)){throw('Cannot find the source image')}
    if(!([System.IO.Path]::IsPathRooted($imageSource))){throw('please enter a full path for your source path')}
    if(!([System.IO.Path]::IsPathRooted($imageTarget))){throw('please enter a full path for your target path')}
    if ($quality -lt 0 -or $quality -gt 100){throw('quality must be between 0 and 100.')}

    $newImgDir = [io.path]::GetDirectoryName($imageTarget)

    if (!(Test-Path $newImgDir)) {
        New-Item $newImgDir -type Directory
    }
 
    [void][System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')
    $bmp = [System.Drawing.Image]::FromFile($imageSource)
 
    #hardcoded canvas size...
    $canvasWidth = $width
    $canvasHeight = $height
 
    #Encoder parameter for image quality
    $myEncoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($myEncoder, $quality)
    # get codec
    $myImageCodecInfo = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()|where {$_.MimeType -eq 'image/jpeg'}
 
    #compute the final ratio to use
    $ratioX = $canvasWidth / $bmp.Width;
    $ratioY = $canvasHeight / $bmp.Height;
    $ratio = $ratioY
    if($ratioX -le $ratioY){
        $ratio = $ratioX
    }
 
    #create resized bitmap
    $newWidth = [int] ($bmp.Width*$ratio)
    $newHeight = [int] ($bmp.Height*$ratio)
    $bmpResized = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graph = [System.Drawing.Graphics]::FromImage($bmpResized)
 
    $graph.Clear([System.Drawing.Color]::White)
    $graph.DrawImage($bmp,0,0 , $newWidth, $newHeight)
 
    echo "Writing $imageSource to $imageTarget..."

    #save to file
    $bmpResized.Save($imageTarget)
    #$bmpResized.Save($imageTarget,$myImageCodecInfo, $encoderParams)
    $bmpResized.Dispose()
    $bmp.Dispose()
}

if ((Test-Path $imgDir) -eq $false) {
    echo "Could not find image directory $imgDir. Please supply valid directory"
    return 1
}

$imgs = Get-ChildItem -Path $imgDir -Filter *.jpg -Recurse
$numImg = $imgs.Length

echo "Found $numImg images to optimize in $imgDir. Starting optimization process..."

for ($i = 0; $i -lt $numImg; $i++) {
    $img = $imgs[$i]
    $source = $img.FullName
    $newName = "$($i+1)"
    $ext = [io.path]::GetExtension($img.Name)
    $thumbTarget = "$destDir\thumbnails\$newName$ext"
    $fullTarget = "$destDir\full\$newName$ext"

    ResizeImage -imageSource $source -imageTarget $thumbTarget -width 200 -height 200 -quality 60

    ResizeImage -imageSource $source -imageTarget $fullTarget -width 1024 -height 1024 -quality 60
}

echo "Done!"

return 0