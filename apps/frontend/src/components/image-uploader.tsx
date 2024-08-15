import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Image } from 'lucide-react'
import { CardContent, Card } from './ui/card'
import { Button } from './ui/button'
interface ImageUploaderProps {
	onFileChange: (file: File | null) => void
}
export default function ImageUploader(
	props: ImageUploaderProps
) {
	const [imagePreview, setImagePreview] = useState<string | null>(null)

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0]
			const reader = new FileReader()

			reader.onload = () => {
				setImagePreview(reader.result as string)
				props.onFileChange(file)
			}

			reader.readAsDataURL(file)
		}
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': []
		},
		maxFiles: 1
	})

	return (
		<Card className="mx-auto">
			<CardContent className="p-6">
				<div
					{...getRootProps()}
					className={`border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer text-center transition-all duration-300 ${
						isDragActive ? 'border-blue-400 bg-blue-50' : ''
					}`}
				>
					<input {...getInputProps()} />
					{imagePreview ? (
						<img
							src={imagePreview}
							alt="Preview"
							className="max-w-full h-auto mt-4 rounded-md"
						/>
					) : (
						<div className="flex flex-col items-center justify-center">
							<Image className="w-12 h-12 text-gray-500" />
							<p className="mt-2 text-gray-500">
								画像をアップロードする
							</p>
						</div>
					)}
				</div>
				{imagePreview && (
					<Button
					variant="secondary"
						className="mt-4"
						onClick={() => setImagePreview(null)}
					>
						Remove Image
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
