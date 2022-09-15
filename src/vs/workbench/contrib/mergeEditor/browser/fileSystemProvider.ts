/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sha1Hex } from 'vs/base/browser/hash';
import { CancellationToken } from 'vs/base/common/cancellation';
import { ReadableStreamEvents } from 'vs/base/common/stream';
import { URI } from 'vs/base/common/uri';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { FileSystemProviderCapabilities, FileType, IFileChange, IFileDeleteOptions, IFileOpenOptions, IFileOverwriteOptions, IFileReadStreamOptions, IFileSystemProvider, IFileWriteOptions, IStat, IWatchOptions } from 'vs/platform/files/common/files';

export class ResultFileProvider {
	constructor(
		@IEnvironmentService private readonly environmentService: IEnvironmentService
	) {
	}

	async getTempResultFileUri(resultFileUri: URI): Promise<URI> {
		const hash = await sha1Hex(resultFileUri.toString());
		const fileName = getFileName(resultFileUri.path);
		const extension = getFileExtension(fileName);
		const resultUri = URI.joinPath(this.environmentService.userRoamingDataHome, 'merges', hash + extension);
		return resultUri;
	}
}

function getFileName(path: string): string {
	const lastSlash = path.lastIndexOf('/');
	if (lastSlash === -1) {
		return path;
	}
	return path.substr(lastSlash + 1);
}

/**
 * The returns the file extension of the given file name. Includes the dot.
 * Returns the empty string if the file name does not have an extension.
*/
function getFileExtension(fileName: string): string {
	const lastDot = fileName.lastIndexOf('.');
	if (lastDot === -1) {
		return '';
	}
	return fileName.substr(lastDot);
}
